// GET /api/orders/[id] — Get single order detail with items and store info

import db from "@/db";
import { orders, orderItems, products, stores } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json({ error: "ID pesanan diperlukan" }, { status: 400 });
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
