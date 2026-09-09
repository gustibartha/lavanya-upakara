// ==========================================
// Lavanya Upakara — Better Auth Client
// ==========================================

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
// Import tipe saja — dihapus saat kompilasi, jadi kode server tidak ikut
// terbawa ke bundle browser.
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
  // Membuat field tambahan seperti phoneNumber ikut bertipe di sisi klien,
  // sehingga salah nama field ketahuan saat kompilasi — bukan baru muncul
  // sebagai "Failed to create user" di produksi.
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { useSession, signIn, signUp, signOut } = authClient;
