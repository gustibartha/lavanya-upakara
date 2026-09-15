// POST /api/admin/login

import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/admin/password";
import { createAdminSession } from "@/lib/admin/session";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  if (!email || !password) {
    return Response.json(
      { error: "Email dan kata sandi wajib diisi" },
      { status: 400 },
    );
  }

  const admin = await db.query.admins.findFirst({
    where: eq(admins.email, email),
  });

  // Pesan yang sama persis untuk "email tidak ada" dan "sandi salah" —
  // membedakannya memberi tahu penyerang akun mana yang benar-benar ada.
  const GAGAL = { error: "Email atau kata sandi salah" } as const;

  if (!admin) {
    return Response.json(GAGAL, { status: 401 });
  }

  const cocok = await verifyPassword(password, admin.password_hash);
  if (!cocok) {
    return Response.json(GAGAL, { status: 401 });
  }

  await createAdminSession(admin.id);

  return Response.json({ nama: admin.nama });
}
