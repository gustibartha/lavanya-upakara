// GET   /api/orders/[id] — detail pesanan beserta toko & item
// PATCH /api/orders/[id] — pembeli mengganti pesanan online yang belum
//                          dibayar menjadi bayar di tempat (COD)

import db from "@/db";
import { orders, orderItems, products, stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PAYABLE } from "@/lib/order-status";
import {
  expireTransaction,
  getTransactionStatus,
  isMidtransConfigured,
  mapTransactionStatus,
} from "@/lib/midtrans";
import { applyMidtransStatus } from "@/lib/apply-payment-status";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { metode_bayar?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }
  if (body.metode_bayar !== "cod") {
    return Response.json({ error: "Hanya bisa mengganti ke bayar di tempat (COD)" }, { status: 400 });
  }

  const { id } = await params;
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order || order.user_id !== session.user.id) {
    return Response.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  if (order.metode_bayar === "cod") {
    return Response.json({ message: "Pesanan sudah memakai COD" });
  }
  if (order.shipping_method === "delivery") {
    return Response.json(
      { error: "Pesanan yang diantar kurir harus dibayar online. COD hanya untuk ambil di toko." },
      { status: 409 },
    );
  }
  if (!PAYABLE.has(order.status_bayar) || order.status !== "menunggu") {
    return Response.json(
      { error: "Metode pembayaran tidak bisa diganti — pesanan sudah dibayar atau sudah diproses" },
      { status: 409 },
    );
  }

  // Pastikan transaksi online yang terakhir dibuka tidak sudah dibayar,
  // lalu matikan kode pembayarannya supaya tidak tertagih dua kali.
  if (order.midtrans_order_id && isMidtransConfigured()) {
    try {
      const terakhir = await getTransactionStatus(order.midtrans_order_id);
      if (mapTransactionStatus(terakhir.transaction_status, terakhir.fraud_status) === "dibayar") {
        await applyMidtransStatus(order, terakhir);
        return Response.json(
          { error: "Pembayaran online untuk pesanan ini ternyata sudah masuk — pesanan sudah lunas" },
          { status: 409 },
        );
      }
      await expireTransaction(order.midtrans_order_id);
    } catch {
      // Belum ada transaksi di Midtrans (Snap ditutup sebelum memilih metode).
    }
  }

  await db
    .update(orders)
    .set({ metode_bayar: "cod", status_bayar: "belum_bayar", payment_type: null })
    .where(eq(orders.id, id));

  return Response.json({ message: "Pembayaran diganti ke bayar di tempat (COD)" });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json({ error: "ID pesanan diperlukan" }, { status: 400 });
    }

    // Respons ini memuat alamat pengantaran dan data pembayaran, jadi hanya
    // pemilik pesanan yang boleh membacanya.
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get order
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!order) {
      return Response.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    if (order.user_id !== session.user.id) {
      // 404, bukan 403 — supaya keberadaan sebuah ID pesanan tidak bocor.
      return Response.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    // Get store
    const [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.id, order.store_id))
      .limit(1);

    // Get items with product details
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.order_id, id));

    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const [product] = await db
          .select()
          .from(products)
          .where(eq(products.id, item.product_id))
          .limit(1);
        return { ...item, product: product || null };
      })
    );

    return Response.json({
      order: {
        ...order,
        store: store || null,
        items: itemsWithProducts,
      },
    });
  } catch (error) {
    console.error("Order detail error:", error);
    return Response.json({ error: "Gagal mengambil data pesanan" }, { status: 500 });
  }
}
