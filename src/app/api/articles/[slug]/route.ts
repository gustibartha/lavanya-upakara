// GET /api/articles/[slug] — satu artikel beserta artikel terkait

import db from "@/db";
import { articles } from "@/db/schema";
import { and, desc, eq, ne } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const [artikel] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.aktif, true)))
    .limit(1);

  if (!artikel) {
    return Response.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
  }

  const terkait = await db
    .select({
      id: articles.id,
      slug: articles.slug,
      judul: articles.judul,
      ringkasan: articles.ringkasan,
      gambar: articles.gambar,
      kategori: articles.kategori,
    })
    .from(articles)
    .where(
      and(
        eq(articles.kategori, artikel.kategori),
        eq(articles.aktif, true),
        ne(articles.id, artikel.id),
      ),
    )
    .orderBy(desc(articles.created_at))
    .limit(3);

  // konten disimpan sebagai JSON array of string (paragraf). Diparse di
  // sini supaya halaman tidak perlu tahu detail bagaimana ia tersimpan.
  let paragraf: string[];
  try {
    paragraf = JSON.parse(artikel.konten);
  } catch {
    paragraf = [artikel.konten];
  }

  return Response.json({
    article: { ...artikel, konten: paragraf },
    related: terkait,
  });
}
