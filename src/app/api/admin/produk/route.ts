// POST /api/admin/produk — menambah produk baru

import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin/guard";
import { randomUUID } from "crypto";
import { categories } from "@/lib/data";

interface ProdukInput {
  nama_produk?: string;
  store_id?: string;
  kategori_slug?: string;
  harga?: number;
  deskripsi?: string;
  emoji?: string;
  bg_color?: string;
  stok?: number;
  populer?: boolean;
}

/** Bikin slug dari nama produk: huruf kecil, spasi jadi tanda hubung,
 *  karakter selain huruf/angka/tanda hubung dibuang. */
function buatSlug(nama: string) {
  return nama
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ProdukInput;
  try {
    body = (await request.json()) as ProdukInput;
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const namaProduk = body.nama_produk?.trim() ?? "";
  const storeId = body.store_id?.trim() ?? "";
  const kategoriSlug = body.kategori_slug?.trim() ?? "";
  const deskripsi = body.deskripsi?.trim() ?? "";
  const harga = Number(body.harga);
  const stok = body.stok !== undefined ? Number(body.stok) : 100;

  if (!namaProduk || !storeId || !kategoriSlug || !deskripsi) {
    return Response.json(
      { error: "Nama produk, toko, kategori, dan deskripsi wajib diisi" },
      { status: 400 },
    );
  }

  if (!Number.isFinite(harga) || harga <= 0) {
    return Response.json({ error: "Harga tidak valid" }, { status: 400 });
  }
  if (!Number.isFinite(stok) || stok < 0) {
    return Response.json({ error: "Stok tidak valid" }, { status: 400 });
  }

  const kategori = categories.find((k) => k.slug === kategoriSlug);
  if (!kategori) {
    return Response.json({ error: "Kategori tidak dikenal" }, { status: 400 });
  }

  const slugDasar = buatSlug(namaProduk);
  if (!slugDasar) {
    return Response.json(
      { error: "Nama produk harus mengandung huruf atau angka" },
      { status: 400 },
    );
  }

  try {
    // Slug harus unik (kolom UNIQUE di database). Kalau bentrok, tambahkan
    // akhiran angka sampai ketemu yang belum dipakai, daripada menolak
    // mentah-mentah dan memaksa admin memikirkan nama lain sendiri.
    let slug = slugDasar;
    for (let i = 2; await produkDenganSlugAda(slug); i++) {
      slug = `${slugDasar}-${i}`;
    }

    const id = `prod-${randomUUID().slice(0, 8)}`;
    await db.insert(products).values({
      id,
      slug,
      store_id: storeId,
      nama_produk: namaProduk,
      kategori: kategori.nama,
      kategori_slug: kategoriSlug,
      harga: Math.round(harga),
      deskripsi,
      emoji: body.emoji?.trim() || "📦",
      bg_color: body.bg_color?.trim() || "#FDF0DC",
      populer: Boolean(body.populer),
      stok: Math.round(stok),
      aktif: true,
    });

    return Response.json({ id, slug }, { status: 201 });
  } catch (error) {
    console.error("Gagal menambah produk:", error);
    return Response.json({ error: "Gagal menyimpan produk" }, { status: 500 });
  }
}

async function produkDenganSlugAda(slug: string) {
  const existing = await db.query.products.findFirst({
    where: (p, { eq }) => eq(p.slug, slug),
  });
  return Boolean(existing);
}
