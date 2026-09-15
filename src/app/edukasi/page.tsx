import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Edukasi & Artikel — Lavanya Upakara",
  description:
    "Artikel seputar makna sarana upacara, persiapan hari raya, dan tradisi Hindu — untuk membantu pemahaman spiritual Anda.",
};

// Halaman ini membaca `articles` langsung dari database. Tanpa ini,
// Next.js mencoba merender halaman jadi HTML statis satu kali saat build —
// artikel yang baru diterbitkan lewat /admin/artikel baru akan muncul
// setelah deploy berikutnya, bukan seketika.
export const dynamic = "force-dynamic";

export default async function EdukasiPage() {
  const daftarArtikel = await db
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
    .where(eq(articles.aktif, true))
    .orderBy(desc(articles.created_at));

  return (
    <>
      <Navbar />
      <main className="page-content">
        <div className="katalog-page">
          <div className="katalog-header">
            <h1 className="katalog-title">Edukasi & Artikel</h1>
            <p className="katalog-subtitle">
              Tingkatkan pemahaman spiritual dan temukan panduan upacara di sini.
            </p>
          </div>

          {daftarArtikel.length > 0 ? (
            <div className="articles-grid" style={{ marginTop: "1rem" }}>
              {daftarArtikel.map((artikel) => (
                <Link
                  key={artikel.id}
                  href={`/edukasi/${artikel.slug}`}
                  className="article-card"
                >
                  <div className="article-img-wrapper">
                    <img src={artikel.gambar} alt={artikel.judul} className="article-img" />
                    <span className="article-category">{artikel.kategori}</span>
                  </div>
                  <div className="article-body">
                    <span className="article-date">
                      {new Date(artikel.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <h3 className="article-title">{artikel.judul}</h3>
                    <p className="article-excerpt">{artikel.ringkasan}</p>
                    <span className="article-read-more">Baca Selengkapnya →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="katalog-empty">
              <div className="katalog-empty-emoji">📖</div>
              <h3>Belum ada artikel</h3>
              <p>Artikel edukasi akan segera hadir di sini.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
