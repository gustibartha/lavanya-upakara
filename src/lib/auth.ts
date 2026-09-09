// ==========================================
// Lavanya Upakara — Better Auth Server Config
// ==========================================

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";

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

  const add = (value?: string) => {
    const raw = value?.trim();
    if (!raw) return;
    try {
      origins.add(new URL(raw.includes("://") ? raw : `https://${raw}`).origin);
    } catch {
      // Nilai yang tidak berbentuk URL diabaikan, bukan membuat server gagal start.
    }
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
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
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
