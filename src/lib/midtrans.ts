// ==========================================
// Lavanya Upakara — Integrasi Midtrans (Snap)
// ==========================================
// Modul ini hanya boleh dipakai di server. Server Key tidak pernah
// dikirim ke browser; yang dipakai di sisi klien hanya Client Key.

import { createHash } from "crypto";

const SNAP_SANDBOX = "https://app.sandbox.midtrans.com/snap/v1/transactions";
const SNAP_PRODUCTION = "https://app.midtrans.com/snap/v1/transactions";

export const isMidtransProduction =
  process.env.MIDTRANS_IS_PRODUCTION === "true";

/** Terpasang kalau Server Key tersedia. Dipakai agar UI bisa menyembunyikan
 *  opsi pembayaran online ketika kredensial belum diisi. */
export function isMidtransConfigured() {
  return Boolean(process.env.MIDTRANS_SERVER_KEY);
}

function serverKey() {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) {
    throw new Error(
      "MIDTRANS_SERVER_KEY belum diset. Isi di environment variable sebelum memakai pembayaran online.",
    );
  }

  // Kunci Sandbox selalu berawalan "SB-Mid-server-", kunci Production tidak.
  // MIDTRANS_IS_PRODUCTION adalah variabel terpisah yang harus disetel manual
  // agar sinkron dengan kunci ini — kalau salah satu tertinggal, permintaan
  // akan dikirim ke API yang salah dan Midtrans membalas dengan pesan yang
  // tidak jelas asal-usulnya (biasanya "Access denied" atau 401). Diperiksa
  // di sini supaya kesalahan konfigurasi ketahuan lewat pesan yang jelas,
  // bukan lewat kegagalan Midtrans yang membingungkan.
  const keyIsSandbox = key.startsWith("SB-Mid-server-");
  if (isMidtransProduction && keyIsSandbox) {
    throw new Error(
      "Konfigurasi tidak cocok: MIDTRANS_SERVER_KEY adalah kunci Sandbox (SB-Mid-server-...) " +
        "tapi MIDTRANS_IS_PRODUCTION=true. Set MIDTRANS_IS_PRODUCTION=false, atau ganti ke kunci Production.",
    );
  }
  if (!isMidtransProduction && !keyIsSandbox) {
    throw new Error(
      "Konfigurasi tidak cocok: MIDTRANS_SERVER_KEY adalah kunci Production " +
        'tapi MIDTRANS_IS_PRODUCTION bukan "true". Set MIDTRANS_IS_PRODUCTION=true, atau ganti ke kunci Sandbox.',
    );
  }

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
