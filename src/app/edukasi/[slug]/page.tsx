import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { and, desc, eq, ne } from "drizzle-orm";

// Sama seperti /edukasi: dipaksa dinamis karena isinya dibaca langsung dari
// database dan bisa berubah (diedit/ditarik jadi draf) kapan saja lewat
// panel admin, bukan cuma pada saat deploy.
export const dynamic = "force-dynamic";

async function ambilArtikel(slug: string) {
  const [artikel] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.aktif, true)))
    .limit(1);
  return artikel ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artikel = await ambilArtikel(slug);
  if (!artikel) return { title: "Artikel Tidak Ditemukan — Lavanya Upakara" };
  return {
    title: `${artikel.judul} — Lavanya Upakara`,
    description: artikel.ringkasan,
  };
}

export default async function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artikel = await ambilArtikel(slug);

  if (!artikel) {
    notFound();
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

  let paragraf: string[];
  try {
    paragraf = JSON.parse(artikel.konten);
  } catch {
    paragraf = [artikel.konten];
  }

  return (
    <>
      <Navbar />
      <main className="page-content">
        <div className="product-detail-page">
          <nav className="breadcrumb">
            <Link href="/">Beranda</Link>
            <span className="breadcrumb-sep">›</span>
            <Link href="/edukasi">Edukasi</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">{artikel.judul}</span>
          </nav>

          <article className="article-detail">
            <span className="article-category article-detail-category">
              {artikel.kategori}
            </span>
            <h1 className="article-detail-title">{artikel.judul}</h1>
            <div className="article-detail-date">
              🗓️{" "}
              {new Date(artikel.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>

            <div className="article-detail-img-wrap">
              <img
                src={artikel.gambar}
                alt={artikel.judul}
                className="article-detail-img"
              />
            </div>

            <div className="article-detail-body">
              {paragraf.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Artikel ini bersifat edukatif umum, bukan ketetapan agama —
                sama seperti disclaimer Asisten AI di Syarat & Ketentuan. */}
            <div className="article-detail-note">
              🙏 Artikel ini disusun sebagai pengantar umum. Tata cara
              upacara dapat berbeda menurut desa, kala, patra, dan tradisi
              keluarga masing-masing — untuk hal yang lebih spesifik, mohon
              berkonsultasi dengan pemangku, sulinggih, atau tetua adat
              setempat.
            </div>
          </article>

          {terkait.length > 0 && (
            <div className="related-products">
              <h2 className="related-title">Artikel Terkait</h2>
              <div className="articles-grid">
                {terkait.map((t) => (
                  <Link
                    key={t.id}
                    href={`/edukasi/${t.slug}`}
                    className="article-card"
                  >
                    <div className="article-img-wrapper">
                      <img src={t.gambar} alt={t.judul} className="article-img" />
                      <span className="article-category">{t.kategori}</span>
                    </div>
                    <div className="article-body">
                      <h3 className="article-title">{t.judul}</h3>
                      <p className="article-excerpt">{t.ringkasan}</p>
                      <span className="article-read-more">Baca Selengkapnya →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
