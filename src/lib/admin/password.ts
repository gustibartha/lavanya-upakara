// ==========================================
// Hash kata sandi admin
// ==========================================
// Memakai scrypt bawaan Node.js (bukan bcrypt/argon2 dari paket luar) —
// ini pola yang didokumentasikan resmi oleh Node.js sendiri untuk hashing
// kata sandi, bukan kripto buatan sendiri. Format simpanannya "salt:hash",
// keduanya hex, dipisah titik dua.

import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const KEYLEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(password, salt, KEYLEN)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;

  const hash = (await scryptAsync(password, salt, KEYLEN)) as Buffer;
  const storedHash = Buffer.from(hashHex, "hex");

  // Panjang harus dicek dulu — timingSafeEqual melempar error kalau kedua
  // buffer beda panjang, bukan mengembalikan false.
  if (hash.length !== storedHash.length) return false;
  return timingSafeEqual(hash, storedHash);
}
