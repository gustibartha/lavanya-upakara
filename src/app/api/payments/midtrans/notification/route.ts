// POST /api/payments/midtrans/notification
// Endpoint yang dipanggil Midtrans setiap status transaksi berubah.
//
// Ini satu-satunya sumber kebenaran status pembayaran. Hasil dari browser
// (callback onSuccess Snap) tidak pernah dipakai untuk melunasi pesanan,
// karena mudah dipalsukan.

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isMidtransConfigured, isValidSignature } from "@/lib/midtrans";
import { applyMidtransStatus } from "@/lib/apply-payment-status";

interface MidtransNotification {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  fraud_status?: string;
  transaction_id?: string;
  payment_type?: string;
  settlement_time?: string;
  transaction_time?: string;
}

export async function POST(request: Request) {
  if (!isMidtransConfigured()) {
    return Response.json({ error: "Midtrans belum dikonfigurasi" }, { status: 503 });
  }

  let payload: MidtransNotification;
  try {
    payload = (await request.json()) as MidtransNotification;
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  // Tolak lebih dulu sebelum menyentuh database.
  //
  // isValidSignature memanggil serverKey(), yang melempar error kalau
  // MIDTRANS_SERVER_KEY belum diset (lihat src/lib/midtrans.ts). Dibungkus
  // try/catch supaya kegagalan seperti itu membalas 500 dengan isi yang
  // tercatat di log, bukan meruntuhkan seluruh permintaan jadi respons
  // kosong yang sulit dibedakan dari kegagalan platform.
  let signatureValid: boolean;
  try {
    signatureValid = isValidSignature(payload);
  } catch (error) {
    console.error("Gagal memverifikasi tanda tangan Midtrans:", error);
    return Response.json(
      { error: "Konfigurasi pembayaran bermasalah" },
      { status: 500 },
    );
  }

  if (!signatureValid) {
    console.warn("Notifikasi Midtrans dengan tanda tangan tidak sah ditolak", {
      order_id: payload.order_id,
    });
    return Response.json({ error: "Tanda tangan tidak sah" }, { status: 403 });
  }

  const midtransOrderId = payload.order_id!;

  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.midtrans_order_id, midtransOrderId),
    });

    if (!order) {
      // Dibalas 200 supaya Midtrans berhenti mengulang notifikasi untuk
      // referensi yang memang tidak kita kenali.
      console.warn("Notifikasi untuk order tidak dikenal:", midtransOrderId);
      return Response.json({ message: "Pesanan tidak dikenal" });
    }

    // Notifikasi bisa datang berkali-kali dan tidak selalu berurutan; aturan
    // soal itu (termasuk pesanan lunas hanya boleh berubah lewat refund) ada
    // di applyMidtransStatus, dipakai bersama dengan endpoint sinkronisasi
    // manual supaya kedua jalur konsisten.
    const hasil = await applyMidtransStatus(order, {
      ...payload,
      // transaction_status opsional di payload webhook (Midtrans bisa saja
      // tidak menyertakannya), tapi applyMidtransStatus butuh nilai pasti —
      // string kosong berakhir di cabang default mapTransactionStatus.
      transaction_status: payload.transaction_status ?? "",
    });

    return Response.json({
      message: hasil.changed ? "Notifikasi diterima" : "Status sudah final",
    });
  } catch (error) {
    console.error("Midtrans notification error:", error);
    // 500 membuat Midtrans mencoba lagi nanti, jadi status tidak hilang.
    return Response.json({ error: "Gagal memproses notifikasi" }, { status: 500 });
  }
}
