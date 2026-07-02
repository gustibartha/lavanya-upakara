import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders, orderItems, products, stores } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.user_id, session.user.id),
      orderBy: [desc(orders.created_at)],
      with: {
        store: true,
        items: {
          with: {
            product: true
          }
        }
      }
    });

    return Response.json({ orders: userOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
