// GET /api/payments/midtrans/status?order_id=...
//
// Menyamakan status pembayaran sebuah pesanan dengan Midtrans secara aktif.
//
// Snap melapor sukses lewat callback di browser, tapi status pesanan hanya
// benar-benar berubah lewat webhook notifikasi — dan webhook itu bisa
// terlambat, gagal terkirim, atau URL-nya belum terdaftar di dashboard
// Midtrans. Tanpa jalur ini, pembeli yang sudah bayar bisa terus melihat
// "Menunggu Pembayaran" tanpa cara untuk memastikan sendiri.

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getTransactionStatus, isMidtransConfigured } from "@/lib/midtrans";
import { applyMidtransStatus } from "@/lib/apply-payment-status";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orderId = new URL(request.url).searchParams.get("order_id");
  if (!orderId) {
    return Response.json({ error: "order_id wajib diisi" }, { status: 400 });
  }

  if (!isMidtransConfigured()) {
    return Response.json(
      { error: "Pembayaran online belum aktif" },
      { status: 503 },
    );
  }

  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order || order.user_id !== session.user.id) {
      // 404, bukan 403 — supaya keberadaan sebuah id pesanan tidak bocor.
      return Response.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    if (!order.midtrans_order_id) {
      // Belum pernah ada percobaan bayar online untuk pesanan ini — tidak
      // ada apa pun di Midtrans untuk ditanyakan.
      return Response.json({ status_bayar: order.status_bayar, changed: false });
    }

    const info = await getTransactionStatus(order.midtrans_order_id);
    const hasil = await applyMidtransStatus(order, info);

    return Response.json({
      status_bayar: hasil.statusBayar,
      changed: hasil.changed,
    });
  } catch (error) {
    console.error("Midtrans status sync error:", error);
    return Response.json(
      { error: "Gagal menyinkronkan status pembayaran" },
      { status: 500 },
    );
  }
}
