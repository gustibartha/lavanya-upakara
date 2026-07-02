import Link from "next/link";

export function Categories() {
  return (
    <section className="categories-section container" id="kategori">
      <div className="section-header anim-fadeup">
        <div className="section-tag">Katalog Lengkap</div>
        <h2 className="section-title">Kategori Pilihan</h2>
        <p className="section-sub">Mulai dari sesajen harian hingga perlengkapan upacara besar.</p>
      </div>
      
      <div className="categories-grid">
        <Link href="/katalog" className="cat-card cat-1 anim-fadeup stagger-1">
          <img src="/images/categories/sesajen.png" alt="Banten & Sesajen" className="category-card-img" />
          <span className="cat-name" style={{position: 'relative', zIndex: 1}}>Banten & Sesajen</span>
          <span className="cat-count" style={{position: 'relative', zIndex: 1}}>240+ Produk</span>
          <div className="cat-arrow" style={{position: 'relative', zIndex: 1}}>→</div>
        </Link>
        <Link href="/katalog" className="cat-card cat-2 anim-fadeup stagger-2">
          <img src="/images/categories/dulang-bokor.png" alt="Dulang & Bokor" className="category-card-img" />
          <span className="cat-name" style={{position: 'relative', zIndex: 1}}>Dulang & Bokor</span>
          <span className="cat-count" style={{position: 'relative', zIndex: 1}}>120+ Produk</span>
          <div className="cat-arrow" style={{position: 'relative', zIndex: 1}}>→</div>
        </Link>
        <Link href="/katalog" className="cat-card cat-3 anim-fadeup stagger-3">
          <img src="/images/categories/dupa-lilin.png" alt="Dupa & Pasepan" className="category-card-img" />
          <span className="cat-name" style={{position: 'relative', zIndex: 1}}>Dupa & Pasepan</span>
          <span className="cat-count" style={{position: 'relative', zIndex: 1}}>85+ Produk</span>
          <div className="cat-arrow" style={{position: 'relative', zIndex: 1}}>→</div>
        </Link>
        <Link href="/katalog" className="cat-card cat-4 anim-fadeup stagger-4">
          <img src="/images/categories/taledan-buah.png" alt="Buah & Jaja" className="category-card-img" />
          <span className="cat-name" style={{position: 'relative', zIndex: 1}}>Buah & Jaja</span>
          <span className="cat-count" style={{position: 'relative', zIndex: 1}}>300+ Produk</span>
          <div className="cat-arrow" style={{position: 'relative', zIndex: 1}}>→</div>
        </Link>
        <Link href="/katalog" className="cat-card cat-5 anim-fadeup stagger-5">
          <img src="/images/categories/pakaian.png" alt="Pakaian Adat" className="category-card-img" />
          <span className="cat-name" style={{position: 'relative', zIndex: 1}}>Pakaian Adat</span>
          <span className="cat-count" style={{position: 'relative', zIndex: 1}}>150+ Produk</span>
          <div className="cat-arrow" style={{position: 'relative', zIndex: 1}}>→</div>
        </Link>
      </div>
    </section>
  );
}

