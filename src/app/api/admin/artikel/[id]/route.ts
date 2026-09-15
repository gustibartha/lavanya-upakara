// PUT /api/admin/artikel/[id] — mengubah artikel, termasuk
// menerbitkan/menarik (aktif) kembali ke draf.

import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminApi } from "@/lib/admin/guard";

interface ArtikelInput {
  judul?: string;
  ringkasan?: string;
  konten?: string[];
  kategori?: string;
  gambar?: string;
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

  let body: ArtikelInput;
  try {
    body = (await request.json()) as ArtikelInput;
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const existing = await db.query.articles.findFirst({
    where: eq(articles.id, id),
  });
  if (!existing) {
    return Response.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
  }

  const perubahan: Partial<typeof articles.$inferInsert> = {};

  if (body.judul !== undefined) {
    const judul = body.judul.trim();
    if (!judul) {
      return Response.json({ error: "Judul tidak boleh kosong" }, { status: 400 });
    }
    perubahan.judul = judul;
  }

  if (body.ringkasan !== undefined) {
    const ringkasan = body.ringkasan.trim();
    if (!ringkasan) {
      return Response.json({ error: "Ringkasan tidak boleh kosong" }, { status: 400 });
    }
    perubahan.ringkasan = ringkasan;
  }

  if (body.kategori !== undefined) {
    const kategori = body.kategori.trim();
    if (!kategori) {
      return Response.json({ error: "Kategori tidak boleh kosong" }, { status: 400 });
    }
    perubahan.kategori = kategori;
  }

  if (body.gambar !== undefined) {
    const gambar = body.gambar.trim();
    if (!gambar) {
      return Response.json({ error: "Gambar wajib diisi" }, { status: 400 });
    }
    perubahan.gambar = gambar;
  }

  if (body.konten !== undefined) {
    const paragraf = Array.isArray(body.konten)
      ? body.konten.map((p) => p.trim()).filter(Boolean)
      : [];
    if (paragraf.length === 0) {
      return Response.json({ error: "Isi artikel tidak boleh kosong" }, { status: 400 });
    }
    perubahan.konten = JSON.stringify(paragraf);
  }

  if (body.aktif !== undefined) perubahan.aktif = Boolean(body.aktif);

  if (Object.keys(perubahan).length === 0) {
    return Response.json({ error: "Tidak ada perubahan dikirim" }, { status: 400 });
  }

  try {
    await db.update(articles).set(perubahan).where(eq(articles.id, id));
    return Response.json({ message: "Artikel diperbarui" });
  } catch (error) {
    console.error("Gagal memperbarui artikel:", error);
    return Response.json({ error: "Gagal menyimpan perubahan" }, { status: 500 });
  }
}
