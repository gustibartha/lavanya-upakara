// ==========================================
// Lavanya Upakara — Integrasi Midtrans (Snap)
// ==========================================
// Modul ini hanya boleh dipakai di server. Server Key tidak pernah
// dikirim ke browser; yang dipakai di sisi klien hanya Client Key.

import { createHash } from "crypto";

const SNAP_SANDBOX = "https://app.sandbox.midtrans.com/snap/v1/transactions";
const SNAP_PRODUCTION = "https://app.midtrans.com/snap/v1/transactions";
const CORE_API_SANDBOX = "https://api.sandbox.midtrans.com/v2";
const CORE_API_PRODUCTION = "https://api.midtrans.com/v2";

export const isMidtransProduction =
  process.env.MIDTRANS_IS_PRODUCTION === "true";

/** Terpasang kalau Server Key tersedia. Dipakai agar UI bisa menyembunyikan
 *  opsi pembayaran online ketika kredensial belum diisi. */
export function isMidtransConfigured() {
  return Boolean(process.env.MIDTRANS_SERVER_KEY?.trim());
}

function serverKey() {
  // Kotak isian environment variable di Vercel, atau proses salin-tempel
  // dari dashboard Midtrans, mudah ikut membawa spasi atau baris baru di
  // ujung kunci. Itu membuat header Basic Auth jadi tidak dikenali Midtrans,
  // dan pesan errornya ("Access denied due to unauthorized transaction")
  // terlihat sama persis dengan kunci yang benar-benar salah — jadi
  // dipangkas di sini daripada dibiarkan menghasilkan kegagalan yang
  // membingungkan.
  const key = process.env.MIDTRANS_SERVER_KEY?.trim();
  if (!key) {
    throw new Error(
      "MIDTRANS_SERVER_KEY belum diset. Isi di environment variable sebelum memakai pembayaran online.",
    );
  }

  // Sempat ada pemeriksaan di sini yang menolak kunci tanpa awalan
  // "SB-Mid-server-" saat MIDTRANS_IS_PRODUCTION=false, dengan asumsi semua
  // kunci Sandbox berawalan begitu. Asumsi itu keliru — sebagian akun
  // merchant Midtrans (termasuk yang lebih baru) menerbitkan kunci Sandbox
  // tanpa awalan "SB-" sama sekali, hanya "Mid-server-...". Pemeriksaan itu
  // pernah menolak kunci Sandbox yang sah hanya karena bentuknya tidak
  // sesuai dugaan. MIDTRANS_IS_PRODUCTION tetap satu-satunya sumber
  // kebenaran soal ke endpoint mana permintaan dikirim; kunci itu sendiri
  // tidak divalidasi bentuknya di sini — biar Midtrans yang memutuskan sah
  // atau tidak lewat balasannya.
  return key;
}

export interface SnapItem {
  id: string;
  price: number;
  quantity: number;
  name: string;
}

export interface CreateSnapInput {
  /** Referensi unik untuk Midtrans. Harus beda tiap percobaan bayar. */
  midtransOrderId: string;
  grossAmount: number;
  items: SnapItem[];
  customer: {
    first_name: string;
    email?: string;
    phone?: string;
  };
  /** Halaman tujuan setelah pembeli menutup Snap. */
  finishUrl?: string;
}

export interface SnapResult {
  token: string;
  redirect_url: string;
}

/**
 * Membuat transaksi Snap dan mengembalikan token untuk dibuka di browser.
 *
 * Midtrans menolak transaksi kalau jumlah item_details tidak sama persis
 * dengan gross_amount, jadi keduanya dihitung dari sumber yang sama.
 */
export async function createSnapTransaction(
  input: CreateSnapInput,
): Promise<SnapResult> {
  const itemsTotal = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (itemsTotal !== input.grossAmount) {
    throw new Error(
      `Total item (${itemsTotal}) tidak sama dengan gross_amount (${input.grossAmount}).`,
    );
  }

  // Nama item dibatasi 50 karakter oleh Midtrans.
  const items = input.items.map((item) => ({
    ...item,
    name: item.name.slice(0, 50),
  }));

  const endpoint = isMidtransProduction ? SNAP_PRODUCTION : SNAP_SANDBOX;
  const auth = Buffer.from(`${serverKey()}:`).toString("base64");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: input.midtransOrderId,
        gross_amount: input.grossAmount,
      },
      item_details: items,
      customer_details: input.customer,
      ...(input.finishUrl ? { callbacks: { finish: input.finishUrl } } : {}),
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.token) {
    const detail =
      data?.error_messages?.join(", ") || data?.status_message || "tidak diketahui";
    throw new Error(`Midtrans menolak transaksi: ${detail}`);
  }

  return { token: data.token, redirect_url: data.redirect_url };
}

export interface StatusMidtransApi {
  transaction_status: string;
  fraud_status?: string;
  transaction_id?: string;
  payment_type?: string;
  settlement_time?: string;
  transaction_time?: string;
  status_code: string;
}

/**
 * Menanyakan status transaksi langsung ke Midtrans, sebagai jaring pengaman
 * ketika webhook notifikasi belum atau tidak pernah sampai — misalnya
 * URL notifikasi belum terdaftar di dashboard, atau sempat gagal terkirim.
 *
 * Dipanggil dengan `midtransOrderId` (referensi yang dikirim ke Midtrans
 * saat transaksi dibuat), bukan id pesanan internal kita.
 */
export async function getTransactionStatus(
  midtransOrderId: string,
): Promise<StatusMidtransApi> {
  const endpoint = isMidtransProduction ? CORE_API_PRODUCTION : CORE_API_SANDBOX;
  const auth = Buffer.from(`${serverKey()}:`).toString("base64");

  const response = await fetch(
    `${endpoint}/${encodeURIComponent(midtransOrderId)}/status`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${auth}`,
      },
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.transaction_status) {
    const detail = data?.status_message || "tidak diketahui";
    throw new Error(`Midtrans menolak permintaan status: ${detail}`);
  }

  return data;
}

/**
 * Memastikan notifikasi benar-benar datang dari Midtrans.
 *
 * Rumus tanda tangannya: sha512(order_id + status_code + gross_amount + server_key).
 * Tanpa pemeriksaan ini, siapa pun bisa menembak endpoint webhook dan
 * menandai pesanan sebagai lunas.
 */
export function isValidSignature(payload: {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
}) {
  const { order_id, status_code, gross_amount, signature_key } = payload;
  if (!order_id || !status_code || !gross_amount || !signature_key) return false;

  const expected = createHash("sha512")
    .update(`${order_id}${status_code}${gross_amount}${serverKey()}`)
    .digest("hex");

  // Panjang selalu sama (128 hex), jadi perbandingan biasa memadai di sini.
  return expected === signature_key;
}

export type StatusBayar =
  | "belum_bayar"
  | "pending"
  | "dibayar"
  | "gagal"
  | "kadaluarsa"
  | "refund";

/**
 * Menerjemahkan transaction_status Midtrans ke status internal.
 *
 * `capture` hanya dianggap lunas bila fraud_status-nya `accept`; kalau masih
 * `challenge`, dana belum pasti dan pesanan tetap menggantung.
 */
export function mapTransactionStatus(
  transactionStatus: string,
  fraudStatus?: string,
): StatusBayar {
  switch (transactionStatus) {
    case "capture":
      return fraudStatus === "accept" ? "dibayar" : "pending";
    case "settlement":
      return "dibayar";
    case "pending":
      return "pending";
    case "deny":
    case "failure":
      return "gagal";
    case "cancel":
      return "gagal";
    case "expire":
      return "kadaluarsa";
    case "refund":
    case "partial_refund":
      return "refund";
    default:
      return "pending";
  }
}
