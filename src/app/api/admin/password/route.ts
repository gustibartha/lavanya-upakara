// POST /api/admin/password — admin yang sedang login mengganti kata sandinya.

import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminApi } from "@/lib/admin/guard";
import { hashPassword, verifyPassword } from "@/lib/admin/password";
import { hapusSesiLain } from "@/lib/admin/session";

const MIN_PANJANG = 8;

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { sandi_lama?: unknown; sandi_baru?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const sandiLama = typeof body.sandi_lama === "string" ? body.sandi_lama : "";
  const sandiBaru = typeof body.sandi_baru === "string" ? body.sandi_baru : "";

  if (!sandiLama || !sandiBaru) {
    return Response.json({ error: "Kata sandi lama dan baru wajib diisi" }, { status: 400 });
  }
  if (sandiBaru.length < MIN_PANJANG) {
    return Response.json(
      { error: `Kata sandi baru minimal ${MIN_PANJANG} karakter` },
      { status: 400 },
    );
  }
  if (sandiBaru === sandiLama) {
    return Response.json({ error: "Kata sandi baru harus berbeda dari yang lama" }, { status: 400 });
  }

  // Sandi lama tetap diminta walau sudah login — supaya orang yang sempat
  // memakai laptop yang tertinggal dalam keadaan login tidak bisa
  // mengambil alih akun.
  if (!(await verifyPassword(sandiLama, admin.password_hash))) {
    return Response.json({ error: "Kata sandi lama salah" }, { status: 403 });
  }

  await db
    .update(admins)
    .set({ password_hash: await hashPassword(sandiBaru) })
    .where(eq(admins.id, admin.id));
  await hapusSesiLain(admin.id);

  return Response.json({ message: "Kata sandi berhasil diganti" });
}
