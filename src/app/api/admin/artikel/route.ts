// POST /api/admin/artikel — menambah artikel baru

import { db } from "@/db";
import { articles } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin/guard";
import { randomUUID } from "crypto";

interface ArtikelInput {
  judul?: string;
  ringkasan?: string;
  konten?: string[];
  kategori?: string;
  gambar?: string;
  aktif?: boolean;
}

/** Sama seperti buatSlug di admin/produk — huruf kecil, spasi jadi tanda
 *  hubung, karakter selain huruf/angka/tanda hubung dibuang. */
function buatSlug(judul: string) {
  return judul
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

  let body: ArtikelInput;
  try {
    body = (await request.json()) as ArtikelInput;
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const judul = body.judul?.trim() ?? "";
  const ringkasan = body.ringkasan?.trim() ?? "";
  const kategori = body.kategori?.trim() ?? "";
  const gambar = body.gambar?.trim() ?? "";
  const paragraf = Array.isArray(body.konten)
    ? body.konten.map((p) => p.trim()).filter(Boolean)
    : [];

  if (!judul || !ringkasan || !kategori || !gambar) {
    return Response.json(
      { error: "Judul, ringkasan, kategori, dan gambar wajib diisi" },
      { status: 400 },
    );
  }
  if (paragraf.length === 0) {
    return Response.json(
      { error: "Isi artikel tidak boleh kosong" },
      { status: 400 },
    );
  }

  const slugDasar = buatSlug(judul);
  if (!slugDasar) {
    return Response.json(
      { error: "Judul harus mengandung huruf atau angka" },
      { status: 400 },
    );
  }

  try {
    let slug = slugDasar;
    for (let i = 2; await artikelDenganSlugAda(slug); i++) {
      slug = `${slugDasar}-${i}`;
    }

    const id = `art-${randomUUID().slice(0, 8)}`;
    await db.insert(articles).values({
      id,
      slug,
      judul,
      ringkasan,
      konten: JSON.stringify(paragraf),
      kategori,
      gambar,
      aktif: body.aktif !== false,
    });

    return Response.json({ id, slug }, { status: 201 });
  } catch (error) {
    console.error("Gagal menambah artikel:", error);
    return Response.json({ error: "Gagal menyimpan artikel" }, { status: 500 });
  }
}

async function artikelDenganSlugAda(slug: string) {
  const existing = await db.query.articles.findFirst({
    where: (a, { eq }) => eq(a.slug, slug),
  });
  return Boolean(existing);
}
