// Data katalog untuk pembeli — dibaca langsung dari database, supaya
// produk yang ditambah/dinonaktifkan lewat /admin/produk langsung berlaku.

import { db } from "@/db";
import { products, stores } from "@/db/schema";
import { and, count, desc, eq } from "drizzle-orm";
import { products as produkAwal } from "@/lib/data";

// Foto produk belum disimpan di database (belum ada fitur unggah). Produk
// awal punya foto di /public; produk baru tampil dengan emoji-nya.
const FOTO_PRODUK = new Map(produkAwal.map((p) => [p.slug, p.image]));

export interface ProdukKatalog {
  id: string;
  slug: string;
  store_id: string;
  nama_produk: string;
  kategori: string;
  kategori_slug: string;
  harga: number;
  deskripsi: string;
  emoji: string;
  bg_color: string;
  populer: boolean;
  image: string | null;
  nama_toko: string;
  alamat_toko: string;
  created_at: string;
}

const kolom = {
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
  created_at: products.created_at,
  nama_toko: stores.nama_toko,
  alamat_toko: stores.alamat,
};

function rapikan(row: Omit<ProdukKatalog, "populer" | "image"> & { populer: boolean | null }): ProdukKatalog {
  return {
    ...row,
    populer: Boolean(row.populer),
    image: FOTO_PRODUK.get(row.slug) ?? null,
  };
}

export async function ambilProdukKatalog(): Promise<ProdukKatalog[]> {
  const rows = await db
    .select(kolom)
    .from(products)
    .innerJoin(stores, eq(products.store_id, stores.id))
    .where(eq(products.aktif, true))
    .orderBy(desc(products.populer), products.nama_produk);
  return rows.map(rapikan);
}

export async function ambilProdukBySlug(slug: string): Promise<ProdukKatalog | null> {
  const [row] = await db
    .select(kolom)
    .from(products)
    .innerJoin(stores, eq(products.store_id, stores.id))
    .where(and(eq(products.slug, slug), eq(products.aktif, true)))
    .limit(1);
  return row ? rapikan(row) : null;
}

export async function hitungKatalog() {
  const [[toko], [produk], perKategori] = await Promise.all([
    db.select({ n: count() }).from(stores),
    db.select({ n: count() }).from(products).where(eq(products.aktif, true)),
    db
      .select({ slug: products.kategori_slug, n: count() })
      .from(products)
      .where(eq(products.aktif, true))
      .groupBy(products.kategori_slug),
  ]);
  return {
    toko: toko.n,
    produk: produk.n,
    perKategori: Object.fromEntries(perKategori.map((r) => [r.slug, r.n])) as Record<string, number>,
  };
}

export async function ambilTokoUnggulan(limit = 4) {
  return db
    .select({ id: stores.id, nama_toko: stores.nama_toko, alamat: stores.alamat, emoji: stores.emoji })
    .from(stores)
    .orderBy(stores.created_at)
    .limit(limit);
}
