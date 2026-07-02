import Link from "next/link";

export function Hero() {
  return (
    <section className="hero container">
      <div className="hero-bg-pattern"></div>
      <div className="hero-inner">
        <div className="hero-text anim-fadeup">
          <div className="hero-badge">
            <div className="hero-badge-dot"></div>
            Marketplace Sarana Upacara #1 di Bali
          </div>
          <h1 className="hero-title">
            Kebutuhan Sembahyang, <em>Satu Ketukan</em> dari Layarmu
          </h1>
          <p className="hero-desc">
            Platform khusus perlengkapan sembahyang Hindu. Temukan toko terdekat, pesan langsung, dan gunakan fitur Asisten AI untuk membantu merencanakan kebutuhan upacara Anda.
          </p>

          <div className="hero-search anim-fadeup stagger-1">
            <span className="hero-search-icon">🔍</span>
            <input type="text" className="hero-search-input" placeholder="Cari canang, dupa, buah..." />
            <button className="hero-search-btn">Cari</button>
          </div>

          <div className="hero-tags anim-fadeup stagger-2">
            <span className="hero-tag-label">Pencarian Populer:</span>
            <Link href="/katalog" className="hero-tag">Canang Sari</Link>
            <Link href="/katalog" className="hero-tag">Dupa Maharaja</Link>
            <Link href="/katalog" className="hero-tag">Dulang Fiber</Link>
          </div>

          <div className="hero-stats anim-fadeup stagger-3">
            <div className="hero-stat">
              <span className="hero-stat-num">500+</span>
              <span className="hero-stat-label">Toko Terdaftar</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-num">1.2K</span>
              <span className="hero-stat-label">Produk Tersedia</span>
            </div>
          </div>
        </div>

        <div className="hero-visual anim-fadeup stagger-4">
          <div className="hero-visual-card main-card">
            <div className="card-header-color"></div>
            <div className="card-body-preview">
              <div className="mini-store-row">
                <img src="/images/stores/default-store.png" alt="Toko" className="mini-store-img" />
                <div className="mini-store-info">
                  <span className="mini-store-name">Toko Sari Ayu</span>
                  <span className="mini-store-dist">0.8 km dari lokasimu</span>
                </div>
                <span className="mini-store-open">Buka</span>
              </div>
              <div className="mini-store-row">
                <img src="/images/stores/default-store.png" alt="Toko" className="mini-store-img" />
                <div className="mini-store-info">
                  <span className="mini-store-name">Baturiti Upakara</span>
                  <span className="mini-store-dist">1.2 km dari lokasimu</span>
                </div>
                <span className="mini-store-open">Buka</span>
              </div>
              <div className="mini-products">
                <div className="mini-prod"><img src="/images/products/canang-sari-harian.png" alt="Canang" /> <span>Canang</span> <b>Rp 10rb</b></div>
                <div className="mini-prod"><img src="/images/products/dupa-harum-pandan.png" alt="Dupa" /> <span>Dupa</span> <b>Rp 15rb</b></div>
              </div>
            </div>
          </div>
          
          <div className="hero-visual-card float-card-1"><span>📍</span> Toko Terdekat</div>
          <div className="hero-visual-card float-card-2"><span>🤖</span> Asisten AI Pintar</div>
          <div className="hero-visual-card float-card-3"><span>💎</span> Harga Transparan</div>
        </div>
      </div>
    </section>
  );
}

