// ==========================================
// Sesi login admin
// ==========================================
// Sengaja tidak memakai Better Auth di sini. Better Auth sudah dipasang
// untuk akun pembeli (yang bisa mendaftar sendiri lewat /daftar), dan
// mencampur admin ke tabel/sesi yang sama membuka celah: kalau suatu saat
// ada bug di endpoint sign-up publik, atau field tambahan yang bisa diisi
// klien (persis yang pernah terjadi dengan phoneNumber di proyek ini),
// risikonya menjalar ke akun yang bisa mengubah katalog dan harga. Modul
// terpisah dan sederhana ini lebih mudah diaudit karena permukaannya kecil.

import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminSessions, type Admin } from "@/db/schema";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

function isProduction() {
  return process.env.NODE_ENV === "production";
}

/** Dipanggil dari route login setelah kata sandi terverifikasi. */
export async function createAdminSession(adminId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.insert(adminSessions).values({
    id: token,
    admin_id: adminId,
    expires_at: expiresAt.toISOString(),
  });

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Dipanggil dari route logout. Menghapus sesi di database, bukan cuma
 *  cookie-nya — supaya token yang sudah dicuri/disalin juga ikut mati. */
export async function destroyAdminSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    await db.delete(adminSessions).where(eq(adminSessions.id, token));
  }
  jar.delete(COOKIE_NAME);
}

/**
 * Membaca sesi admin dari cookie permintaan saat ini. Mengembalikan `null`
 * kalau tidak ada cookie, token tidak dikenal, atau sudah kedaluwarsa —
 * pemanggil tidak perlu tahu bedanya, cukup anggap "tidak login".
 */
export async function getAdminSession(): Promise<Admin | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await db.query.adminSessions.findFirst({
    where: eq(adminSessions.id, token),
    with: { admin: true },
  });

  if (!session) return null;
  if (new Date(session.expires_at) < new Date()) return null;

  return session.admin;
}
