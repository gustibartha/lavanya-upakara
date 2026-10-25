// POST /api/payments/midtrans — membuat token Snap untuk sebuah pesanan

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import {
  createSnapTransaction,
  expireTransaction,
  getTransactionStatus,
  isMidtransConfigured,
  mapTransactionStatus,
  type SnapItem,
} from "@/lib/midtrans";
import { applyMidtransStatus } from "@/lib/apply-payment-status";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMidtransConfigured()) {
    return Response.json(
      { error: "Pembayaran online belum aktif. Hubungi admin." },
      { status: 503 },
    );
  }

  let orderId: string | undefined;
  try {
    ({ order_id: orderId } = (await request.json()) as { order_id?: string });
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  if (!orderId) {
    return Response.json({ error: "order_id wajib diisi" }, { status: 400 });
  }

  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: { items: { with: { product: true } } },
    });

    if (!order) {
      return Response.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    // Pesanan orang lain tidak boleh dibayarkan dari akun ini.
    if (order.user_id !== session.user.id) {
      return Response.json({ error: "Bukan pesanan Anda" }, { status: 403 });
    }

    if (order.status_bayar === "dibayar") {
      return Response.json(
        { error: "Pesanan ini sudah dibayar" },
        { status: 409 },
      );
    }

    // Pembeli membuka pembayaran lagi (mis. salah memilih QRIS dan ingin
    // ganti metode). Sebelum membuat transaksi baru: kalau transaksi lama
    // ternyata sudah dibayar, catat dan jangan tagih lagi; kalau belum,
    // akhiri transaksinya supaya kode QRIS/VA lama tidak bisa dibayar
    // dobel. Kegagalan di langkah ini tidak menghentikan pembayaran baru —
    // misalnya Snap lama yang belum sempat memilih metode memang tidak
    // punya transaksi untuk diakhiri.
    if (order.midtrans_order_id) {
      try {
        const lama = await getTransactionStatus(order.midtrans_order_id);
        if (mapTransactionStatus(lama.transaction_status, lama.fraud_status) === "dibayar") {
          await applyMidtransStatus(order, lama);
          return Response.json({ error: "Pesanan ini sudah dibayar" }, { status: 409 });
        }
        await expireTransaction(order.midtrans_order_id);
      } catch {
        // Transaksi lama tidak ditemukan di Midtrans — tidak ada yang perlu diakhiri.
      }
    }

    // Nominal dan rincian item selalu dihitung ulang dari database — nilai
    // dari browser tidak pernah dipercaya untuk urusan uang.
    const items: SnapItem[] = order.items.map((item) => ({
      id: item.product_id,
      price: item.harga_satuan,
      quantity: item.jumlah,
      name: item.product?.nama_produk ?? "Produk",
    }));

    const grossAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (grossAmount <= 0) {
      return Response.json(
        { error: "Nilai pesanan tidak valid" },
        { status: 400 },
      );
    }

    // Midtrans menolak order_id yang pernah dipakai, jadi tiap percobaan bayar
    // memakai referensi baru. Pemetaan balik ke pesanan lewat kolom ini.
    const midtransOrderId = `${order.id}-${Date.now().toString(36)}`;

    const origin = new URL(request.url).origin;
    const snap = await createSnapTransaction({
      midtransOrderId,
      grossAmount,
      items,
      customer: {
        first_name: session.user.name || "Pelanggan",
        email: session.user.email || undefined,
      },
      finishUrl: `${origin}/riwayat/${order.id}`,
    });

    await db
      .update(orders)
      .set({
        metode_bayar: "midtrans",
        status_bayar: "pending",
        midtrans_order_id: midtransOrderId,
      })
      .where(eq(orders.id, order.id));

    return Response.json({
      token: snap.token,
      redirect_url: snap.redirect_url,
      order_id: order.id,
    });
  } catch (error) {
    console.error("Midtrans transaction error:", error);

    // Pesan penolakan dari createSnapTransaction sudah berisi balasan
    // Midtrans sendiri (tidak memuat rahasia), jadi aman diteruskan apa
    // adanya — tanpa ini semua kegagalan berakhir jadi satu kalimat generik
    // yang tidak bisa ditindaklanjuti siapa pun.
    const pesan =
      error instanceof Error && error.message.startsWith("Midtrans menolak transaksi:")
        ? error.message
        : "Gagal membuat transaksi pembayaran";

    return Response.json({ error: pesan }, { status: 500 });
  }
}
