import Link from "next/link";

export function Articles() {
  const articles = [
    {
      id: 1,
      title: "Memahami Makna Banten Pejati dalam Upacara",
      date: "12 Mar 2026",
      category: "Edukasi",
      image: "/images/categories/sesajen.png",
      excerpt: "Banten Pejati merupakan salah satu sarana upacara dasar yang wajib ada dalam berbagai ritual Hindu di Bali. Mari kenali komponennya.",
    },
    {
      id: 2,
      title: "Persiapan Menyambut Hari Raya Galungan",
      date: "05 Mar 2026",
      category: "Hari Raya",
      image: "/images/products/sesajen-galungan.png",
      excerpt: "Hari kemenangan Dharma melawan Adharma sebentar lagi tiba. Apa saja perlengkapan yang perlu Anda persiapkan dari sekarang?",
    },
    {
      id: 3,
      title: "Filosofi Dupa: Lebih dari Sekadar Pengharum",
      date: "28 Feb 2026",
      category: "Tradisi",
      image: "/images/products/dupa-harum-pandan.png",
      excerpt: "Asap dupa melambangkan doa umat yang membubung ke hadapan Ida Sang Hyang Widhi Wasa. Ketahui jenis dupa terbaik untuk sembahyang.",
    },
  ];

  return (
    <section className="articles-section container" id="artikel">
      <div className="section-row">
        <div className="section-header anim-fadeup" style={{ marginBottom: 0 }}>
          <div className="section-tag">Blog & Edukasi</div>
          <h2 className="section-title">Artikel Terbaru</h2>
          <p className="section-sub">Tingkatkan pemahaman spiritual dan temukan panduan upacara di sini.</p>
        </div>
        <Link href="#" className="btn btn-outline anim-fadeup stagger-1">
          Lihat Semua Artikel
        </Link>
      </div>

      <div className="articles-grid">
        {articles.map((article, i) => (
          <Link href="#" key={article.id} className={`article-card anim-fadeup stagger-${(i % 3) + 1}`}>
            <div className="article-img-wrapper">
              <img src={article.image} alt={article.title} className="article-img" />
              <span className="article-category">{article.category}</span>
            </div>
            <div className="article-body">
              <span className="article-date">{article.date}</span>
              <h3 className="article-title">{article.title}</h3>
              <p className="article-excerpt">{article.excerpt}</p>
              <span className="article-read-more">Baca Selengkapnya →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
