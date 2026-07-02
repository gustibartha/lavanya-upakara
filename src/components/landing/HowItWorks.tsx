export function HowItWorks() {
  return (
    <section className="how-section" id="cara-kerja">
      <div className="container">
        <div className="section-header anim-fadeup" style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 3.5rem" }}>
          <div className="section-tag">Mudah & Cepat</div>
          <h2 className="section-title">Cara Kerja Lavanya Upakara</h2>
          <p className="section-sub">Tidak perlu keliling pasar. Kami yang hubungkan kamu dengan toko terdekat.</p>
        </div>

        <div className="how-grid anim-fadeup stagger-2">
          <div className="how-step">
            <div className="how-num">1</div>
            <div className="how-icon">📍</div>
            <h3 className="how-title">Cari & Temukan</h3>
            <p className="how-desc">Pilih perlengkapan atau cari toko terdekat dari lokasimu saat ini.</p>
          </div>
          
          <div className="how-connector">➔</div>
          
          <div className="how-step">
            <div className="how-num">2</div>
            <div className="how-icon">🛍️</div>
            <h3 className="how-title">Pesan & Bayar</h3>
            <p className="how-desc">Pesan melalui sistem kami dengan harga transparan tanpa biaya tersembunyi.</p>
          </div>
          
          <div className="how-connector">➔</div>
          
          <div className="how-step">
            <div className="how-num">3</div>
            <div className="how-icon">🛵</div>
            <h3 className="how-title">Ambil / Antar</h3>
            <p className="how-desc">Pilih untuk ambil sendiri di toko (pickup) atau diantar oleh kurir mitra.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

