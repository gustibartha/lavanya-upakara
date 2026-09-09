// POST /api/payments/midtrans — membuat token Snap untuk sebuah pesanan

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import {
  createSnapTransaction,
  isMidtransConfigured,
  type SnapItem,
} from "@/lib/midtrans";

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

    // Dua jenis error aman diteruskan apa adanya ke pemakai — balasan
    // Midtrans sendiri, dan pemeriksaan konfigurasi kami — karena keduanya
    // tidak memuat rahasia. Tanpa ini semua kegagalan berakhir jadi pesan
    // generik yang tidak bisa ditindaklanjuti siapa pun.
    const bolehDiperlihatkan = (msg: string) =>
      msg.startsWith("Midtrans menolak transaksi:") ||
      msg.startsWith("Konfigurasi tidak cocok:");
    const pesan =
      error instanceof Error && bolehDiperlihatkan(error.message)
        ? error.message
        : "Gagal membuat transaksi pembayaran";

    return Response.json({ error: pesan }, { status: 500 });
  }
}
