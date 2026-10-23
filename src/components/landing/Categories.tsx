import Link from "next/link";

const KARTU = [
  { slug: "sesajen", nama: "Banten & Sesajen", image: "/images/categories/sesajen.png" },
  { slug: "dulang-bokor", nama: "Dulang & Bokor", image: "/images/categories/dulang-bokor.png" },
  { slug: "dupa-lilin", nama: "Dupa & Pasepan", image: "/images/categories/dupa-lilin.png" },
  { slug: "taledan-buah", nama: "Buah & Jaja", image: "/images/categories/taledan-buah.png" },
  { slug: "pakaian", nama: "Pakaian Adat", image: "/images/categories/pakaian.png" },
];

export function Categories({ jumlahPerKategori }: { jumlahPerKategori: Record<string, number> }) {
  return (
    <section className="categories-section container" id="kategori">
      <div className="section-header anim-fadeup">
        <div className="section-tag">Katalog Lengkap</div>
        <h2 className="section-title">Kategori Pilihan</h2>
        <p className="section-sub">Mulai dari sesajen harian hingga perlengkapan upacara besar.</p>
      </div>

      <div className="categories-grid">
        {KARTU.map((k, i) => {
          const jumlah = jumlahPerKategori[k.slug] ?? 0;
          return (
            <Link
              key={k.slug}
              href={`/katalog?kategori=${k.slug}`}
              className={`cat-card cat-${i + 1} anim-fadeup stagger-${i + 1}`}
              data-reveal="scale"
            >
              <img src={k.image} alt={k.nama} className="category-card-img" />
              <span className="cat-name" style={{ position: "relative", zIndex: 1 }}>{k.nama}</span>
              <span className="cat-count" style={{ position: "relative", zIndex: 1 }}>
                {jumlah > 0 ? `${jumlah} Produk` : "Segera hadir"}
              </span>
              <div className="cat-arrow" style={{ position: "relative", zIndex: 1 }}>→</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
