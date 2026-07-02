// GET /api/products — List all products with optional filters
// Query params: ?kategori=sesajen&q=canang&populer=true

import db from "@/db";
import { products, stores } from "@/db/schema";
import { eq, ilike, and, or, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kategori = searchParams.get("kategori");
  const q = searchParams.get("q");
  const populer = searchParams.get("populer");
  const store_id = searchParams.get("store_id");

  const conditions = [];

  if (kategori && kategori !== "semua") {
    conditions.push(eq(products.kategori_slug, kategori));
  }

  if (q) {
    const searchTerm = `%${q}%`;
    conditions.push(
      or(
        ilike(products.nama_produk, searchTerm),
        ilike(products.kategori, searchTerm),
        ilike(products.deskripsi, searchTerm)
      )!
    );
  }

  if (populer === "true") {
    conditions.push(eq(products.populer, true));
  }

  if (store_id) {
    conditions.push(eq(products.store_id, store_id));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db
    .select({
      id: products.id,
      slug: products.slug,
      store_id: products.store_id,
      nama_produk: products.nama_produk,
      kategori: products.kategori,
      kategori_slug: products.kategori_slug,
      harga: products.harga,
      deskripsi: products.deskripsi,
      emoji: products.emoji,
      bg_color: products.bg_color,
      populer: products.populer,
      stok: products.stok,
      nama_toko: stores.nama_toko,
      store_emoji: stores.emoji,
    })
    .from(products)
    .leftJoin(stores, eq(products.store_id, stores.id))
    .where(where);

  return Response.json({ products: result, total: result.length });
}
