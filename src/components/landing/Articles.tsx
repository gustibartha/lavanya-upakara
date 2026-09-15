import Link from "next/link";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function Articles() {
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
    .orderBy(desc(articles.created_at))
    .limit(3);

  // Bagian ini disembunyikan sampai ada artikel yang diterbitkan — daripada
  // menampilkan kartu kosong atau memaksa tiga artikel contoh selalu ada.
  if (daftarArtikel.length === 0) return null;

  return (
    <section className="articles-section container" id="artikel">
      <div className="section-row">
        <div className="section-header anim-fadeup" data-reveal="left" style={{ marginBottom: 0 }}>
          <div className="section-tag">Blog & Edukasi</div>
          <h2 className="section-title">Artikel Terbaru</h2>
          <p className="section-sub">Tingkatkan pemahaman spiritual dan temukan panduan upacara di sini.</p>
        </div>
        <Link href="/edukasi" className="btn btn-outline anim-fadeup stagger-1" data-reveal="right">
          Lihat Semua Artikel
        </Link>
      </div>

      <div className="articles-grid">
        {daftarArtikel.map((artikel, i) => (
          <Link
            href={`/edukasi/${artikel.slug}`}
            key={artikel.id}
            className={`article-card anim-fadeup stagger-${(i % 3) + 1}`}
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
    </section>
  );
}
