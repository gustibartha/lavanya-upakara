// GET /api/products/[slug] — Get single product by slug

import db from "@/db";
import { products, stores } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const [result] = await db
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
      store_alamat: stores.alamat,
      store_telepon: stores.telepon,
    })
    .from(products)
    .leftJoin(stores, eq(products.store_id, stores.id))
    // Produk nonaktif dianggap tidak ada — tautan lama (keranjang, riwayat
    // pencarian, dsb) tidak boleh tetap bisa dibeli lewat halaman detailnya.
    .where(and(eq(products.slug, slug), eq(products.aktif, true)))
    .limit(1);

  if (!result) {
    return Response.json({ error: "Produk tidak ditemukan" }, { status: 404 });
  }

  // Also fetch related products (same category, different product)
  const related = await db
    .select({
      id: products.id,
      slug: products.slug,
      nama_produk: products.nama_produk,
      harga: products.harga,
      emoji: products.emoji,
      bg_color: products.bg_color,
      kategori: products.kategori,
    })
    .from(products)
    .where(
      and(eq(products.kategori_slug, result.kategori_slug), eq(products.aktif, true)),
    )
    .limit(4);

  return Response.json({
    product: result,
    related: related.filter((r) => r.id !== result.id).slice(0, 3),
  });
}
