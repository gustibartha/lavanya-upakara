// PUT /api/admin/produk/[id] — mengubah produk yang sudah ada, termasuk
// mengaktifkan/menonaktifkannya.

import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminApi } from "@/lib/admin/guard";
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
  aktif?: boolean;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdminApi();
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: ProdukInput;
  try {
    body = (await request.json()) as ProdukInput;
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const existing = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  if (!existing) {
    return Response.json({ error: "Produk tidak ditemukan" }, { status: 404 });
  }

  // Setiap field opsional — hanya yang dikirim yang diperbarui. Ini juga
  // yang dipakai tombol nonaktifkan/aktifkan: cukup kirim { aktif: false }.
  const perubahan: Partial<typeof products.$inferInsert> = {};

  if (body.nama_produk !== undefined) {
    const nama = body.nama_produk.trim();
    if (!nama) {
      return Response.json({ error: "Nama produk tidak boleh kosong" }, { status: 400 });
    }
    perubahan.nama_produk = nama;
  }

  if (body.store_id !== undefined) {
    if (!body.store_id.trim()) {
      return Response.json({ error: "Toko wajib dipilih" }, { status: 400 });
    }
    perubahan.store_id = body.store_id.trim();
  }

  if (body.kategori_slug !== undefined) {
    const kategori = categories.find((k) => k.slug === body.kategori_slug);
    if (!kategori) {
      return Response.json({ error: "Kategori tidak dikenal" }, { status: 400 });
    }
    perubahan.kategori_slug = kategori.slug;
    perubahan.kategori = kategori.nama;
  }

  if (body.harga !== undefined) {
    const harga = Number(body.harga);
    if (!Number.isFinite(harga) || harga <= 0) {
      return Response.json({ error: "Harga tidak valid" }, { status: 400 });
    }
    perubahan.harga = Math.round(harga);
  }

  if (body.deskripsi !== undefined) {
    const deskripsi = body.deskripsi.trim();
    if (!deskripsi) {
      return Response.json({ error: "Deskripsi tidak boleh kosong" }, { status: 400 });
    }
    perubahan.deskripsi = deskripsi;
  }

  if (body.stok !== undefined) {
    const stok = Number(body.stok);
    if (!Number.isFinite(stok) || stok < 0) {
      return Response.json({ error: "Stok tidak valid" }, { status: 400 });
    }
    perubahan.stok = Math.round(stok);
  }

  if (body.emoji !== undefined) perubahan.emoji = body.emoji.trim() || "📦";
  if (body.bg_color !== undefined) perubahan.bg_color = body.bg_color.trim() || "#FDF0DC";
  if (body.populer !== undefined) perubahan.populer = Boolean(body.populer);
  if (body.aktif !== undefined) perubahan.aktif = Boolean(body.aktif);

  if (Object.keys(perubahan).length === 0) {
    return Response.json({ error: "Tidak ada perubahan dikirim" }, { status: 400 });
  }

  try {
    await db.update(products).set(perubahan).where(eq(products.id, id));
    return Response.json({ message: "Produk diperbarui" });
  } catch (error) {
    console.error("Gagal memperbarui produk:", error);
    return Response.json({ error: "Gagal menyimpan perubahan" }, { status: 500 });
  }
}
