// ==========================================
// Penjaga akses admin
// ==========================================
// Sengaja diperiksa di dalam tiap Server Component/route, bukan lewat
// middleware.ts. Middleware Next.js berjalan di Edge runtime secara
// default, sementara koneksi database di proyek ini (paket `postgres`)
// perlu Node.js runtime — memaksakannya ke middleware berisiko gagal diam-
// diam. Pola ini juga konsisten dengan cara auth.api.getSession() dipakai
// di setiap route API pembeli di proyek ini.

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/session";
import type { Admin } from "@/db/schema";

/** Untuk Server Component halaman admin. Redirect ke /admin/login kalau
 *  belum ada sesi yang sah — halaman itu sendiri tidak perlu memeriksa apa-
 *  apa lagi setelah memanggil ini. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** Untuk route API admin. Mengembalikan admin yang login, atau `null` kalau
 *  tidak — pemanggil yang memutuskan bentuk respons 401-nya, karena route
 *  API tidak boleh redirect seperti halaman. */
export async function requireAdminApi(): Promise<Admin | null> {
  return getAdminSession();
}
