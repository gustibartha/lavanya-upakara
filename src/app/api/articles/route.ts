// GET /api/articles — daftar artikel yang sudah diterbitkan
// Query params: ?kategori=Edukasi&q=canang

import db from "@/db";
import { articles } from "@/db/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kategori = searchParams.get("kategori");
  const q = searchParams.get("q");

  // Draf (aktif=false) tidak pernah tampil di sini — hanya lewat panel admin.
  const conditions = [eq(articles.aktif, true)];

  if (kategori && kategori !== "semua") {
    conditions.push(eq(articles.kategori, kategori));
  }

  if (q) {
    const term = `%${q}%`;
    conditions.push(
      or(ilike(articles.judul, term), ilike(articles.ringkasan, term))!,
    );
  }

  const result = await db
    .select({
      id: articles.id,
      slug: articles.slug,
      judul: articles.judul,
      ringkasan: articles.ringkasan,
      kategori: articles.kategori,
      gambar: articles.gambar,
      created_at: articles.created_at,
    })
    .from(articles)
    .where(and(...conditions))
    .orderBy(desc(articles.created_at));

  return Response.json({ articles: result, total: result.length });
}
