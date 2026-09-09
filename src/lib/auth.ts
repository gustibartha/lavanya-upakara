// ==========================================
// Lavanya Upakara — Better Auth Server Config
// ==========================================

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";

const isVercel = Boolean(process.env.VERCEL);

/** Menambahkan https:// bila host diberikan tanpa skema (gaya Vercel). */
function toURL(value?: string): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  try {
    return new URL(raw.includes("://") ? raw : `https://${raw}`).origin;
  } catch {
    return undefined;
  }
}

/**
 * Alamat dasar Better Auth.
 *
 * Origin dari baseURL ini otomatis ikut dipercaya, jadi kalau salah, semua
 * login dan pendaftaran ditolak "Invalid origin".
 *
 * BETTER_AUTH_URL yang menunjuk localhost padahal berjalan di Vercel sudah
 * pasti keliru — biasanya tersalin dari contoh konfigurasi lokal. Dalam
 * keadaan itu alamat produksi dari Vercel yang dipakai, supaya satu salah
 * ketik tidak mematikan seluruh autentikasi.
 */
function resolveBaseURL(): string | undefined {
  const explicit = toURL(process.env.BETTER_AUTH_URL);
  const vercelProduction = toURL(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  const isLocal = explicit
    ? /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(explicit)
    : false;

  if (explicit && !(isVercel && isLocal)) return explicit;
  return vercelProduction ?? explicit;
}

/**
 * Daftar origin yang boleh memakai endpoint autentikasi.
 *
 * Sebelumnya isinya hanya localhost, sehingga login dari domain produksi
 * ditolak dengan "Invalid origin". Alamat deployment sekarang diambil dari
 * environment variable yang otomatis disediakan Vercel, jadi domain produksi
 * maupun preview ikut dipercaya tanpa perlu diubah manual.
 *
 * Sengaja tidak memakai wildcard seperti "*.vercel.app" — itu akan
 * mempercayai situs milik orang lain.
 */
function buildTrustedOrigins(): string[] {
  const origins = new Set<string>([
    "http://localhost:3000",
    "http://localhost:3001",
  ]);

  // Nilai yang tidak berbentuk URL dilewati, bukan membuat server gagal start.
  const add = (value?: string) => {
    const origin = toURL(value);
    if (origin) origins.add(origin);
  };

  add(process.env.BETTER_AUTH_URL);
  // Disediakan Vercel: domain produksi tetap, URL unik per-deployment, dan per-branch.
  add(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  add(process.env.VERCEL_URL);
  add(process.env.VERCEL_BRANCH_URL);
  // Jalan keluar untuk domain kustom — dipisah koma.
  for (const extra of (process.env.AUTH_TRUSTED_ORIGINS ?? "").split(",")) {
    add(extra);
  }

  return [...origins];
}

export const auth = betterAuth({
  baseURL: resolveBaseURL(),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        // Akun lama tidak punya nomor, jadi tidak boleh diwajibkan di
        // tingkat model — formulir pendaftaran yang mewajibkannya.
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  trustedOrigins: buildTrustedOrigins(),
});
