// POST /api/payments/midtrans/notification
// Endpoint yang dipanggil Midtrans setiap status transaksi berubah.
//
// Ini satu-satunya sumber kebenaran status pembayaran. Hasil dari browser
// (callback onSuccess Snap) tidak pernah dipakai untuk melunasi pesanan,
// karena mudah dipalsukan.

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  isMidtransConfigured,
  isValidSignature,
  mapTransactionStatus,
} from "@/lib/midtrans";

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
  if (!isValidSignature(payload)) {
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

    const statusBayar = mapTransactionStatus(
      payload.transaction_status ?? "",
      payload.fraud_status,
    );

    // Notifikasi bisa datang berkali-kali dan tidak selalu berurutan.
    // Pesanan yang sudah lunas hanya boleh berubah oleh refund.
    if (order.status_bayar === "dibayar" && statusBayar !== "refund") {
      return Response.json({ message: "Status sudah final" });
    }

    const paidAt =
      statusBayar === "dibayar"
        ? payload.settlement_time ?? payload.transaction_time ?? new Date().toISOString()
        : null;

    await db
      .update(orders)
      .set({
        status_bayar: statusBayar,
        midtrans_transaction_id: payload.transaction_id ?? null,
        payment_type: payload.payment_type ?? null,
        paid_at: paidAt,
        // Pesanan baru masuk antrean toko setelah dananya benar-benar diterima.
        ...(statusBayar === "dibayar" && order.status === "menunggu"
          ? { status: "diproses" }
          : {}),
      })
      .where(eq(orders.id, order.id));

    return Response.json({ message: "Notifikasi diterima" });
  } catch (error) {
    console.error("Midtrans notification error:", error);
    // 500 membuat Midtrans mencoba lagi nanti, jadi status tidak hilang.
    return Response.json({ error: "Gagal memproses notifikasi" }, { status: 500 });
  }
}
