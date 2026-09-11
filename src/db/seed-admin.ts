// ==========================================
// Membuat atau memperbarui satu akun admin
// ==========================================
// Beda dari src/db/seed.ts: skrip ini TIDAK menghapus apa pun. Aman
// dijalankan kapan saja — kalau email sudah terdaftar, kata sandi dan
// namanya diperbarui; kalau belum, akun baru dibuat.
//
// Jalankan dengan:
//   ADMIN_EMAIL=admin@contoh.com ADMIN_PASSWORD=rahasia ADMIN_NAMA="Nama Anda" npx tsx src/db/seed-admin.ts
// atau isi ketiganya di .env.local lalu jalankan `npm run db:seed-admin`.

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import * as schema from "./schema";
import { hashPassword } from "../lib/admin/password";

dotenv.config({ path: ".env.local" });

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const nama = process.env.ADMIN_NAMA?.trim() || "Admin";

  if (!email || !password) {
    console.error(
      "ADMIN_EMAIL dan ADMIN_PASSWORD wajib diisi (lewat .env.local atau environment variable langsung).",
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("ADMIN_PASSWORD terlalu pendek — minimal 8 karakter.");
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL tidak ditemukan.");
    process.exit(1);
  }

  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client, { schema });

  try {
    const passwordHash = await hashPassword(password);
    const existing = await db.query.admins.findFirst({
      where: eq(schema.admins.email, email),
    });

    if (existing) {
      await db
        .update(schema.admins)
        .set({ password_hash: passwordHash, nama })
        .where(eq(schema.admins.id, existing.id));
      console.log(`✅ Akun admin "${email}" diperbarui.`);
    } else {
      await db.insert(schema.admins).values({
        id: `admin-${randomUUID().slice(0, 8)}`,
        email,
        password_hash: passwordHash,
        nama,
      });
      console.log(`✅ Akun admin "${email}" dibuat.`);
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Gagal:", err);
  process.exit(1);
});
