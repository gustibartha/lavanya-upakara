// POST /api/orders — Create a new order

import db from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

interface OrderItemInput {
  product_id: string;
  jumlah: number;
}

interface OrderInput {
  user_id: string;
  store_id: string;
  items: OrderItemInput[];
  jalan: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kodepos?: string;
  shipping_method: string;
  shipping_service?: string;
  catatan?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderInput;

    if (!body.user_id || !body.store_id || !body.items?.length) {
      return Response.json(
        { error: "user_id, store_id, dan items wajib diisi" },
        { status: 400 }
      );
    }

    // Calculate total from product prices
    let totalHarga = 0;
    const itemsWithPrice: Array<OrderItemInput & { harga_satuan: number }> = [];

    for (const item of body.items) {
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, item.product_id))
        .get();

      if (!product) {
        return Response.json(
          { error: `Produk ${item.product_id} tidak ditemukan` },
          { status: 404 }
        );
      }

      totalHarga += product.harga * item.jumlah;
      itemsWithPrice.push({ ...item, harga_satuan: product.harga });
    }

    const orderId = `order-${randomUUID().slice(0, 8)}`;

    // Insert order
    await db.insert(orders).values({
      id: orderId,
      user_id: body.user_id,
      store_id: body.store_id,
      total_harga: totalHarga,
      status: "menunggu",
      jalan: body.jalan || null,
      kelurahan: body.kelurahan || null,
      kecamatan: body.kecamatan || null,
      kota: body.kota || null,
      provinsi: body.provinsi || null,
      kodepos: body.kodepos || null,
      shipping_method: body.shipping_method || "pickup",
      shipping_service: body.shipping_service || null,
      catatan: body.catatan || null,
    });

    // Insert order items
    for (const item of itemsWithPrice) {
      await db.insert(orderItems).values({
        id: `oi-${randomUUID().slice(0, 8)}`,
        order_id: orderId,
        product_id: item.product_id,
        jumlah: item.jumlah,
        harga_satuan: item.harga_satuan,
      });
    }

    return Response.json(
      {
        order: {
          id: orderId,
          total_harga: totalHarga,
          status: "menunggu",
          items: itemsWithPrice.length,
        },
        message: "Pesanan berhasil dibuat! 🙏",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return Response.json(
      { error: "Gagal membuat pesanan" },
      { status: 500 }
    );
  }
}

// GET /api/orders?user_id=user-1
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return Response.json({ error: "user_id wajib diisi" }, { status: 400 });
  }

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.user_id, userId))
    .all();

  return Response.json({ orders: userOrders, total: userOrders.length });
}
