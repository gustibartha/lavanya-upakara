import Link from "next/link";

export function CTASection() {
  return (
    <section className="cta-section" id="unduh">
      <div className="section-tag">Mulai Sekarang, Gratis</div>
      <h2 className="section-title">
        Sembahyang Lebih{" "}
        <em
          style={{
            fontFamily: "var(--font-playfair), serif",
            color: "var(--kunyit)",
          }}
        >
          Tenang,
        </em>
        <br />
        Hidup Lebih Seimbang
      </h2>
      <p className="section-sub">
        Akses Lavanya Upakara sekarang dan temukan toko perlengkapan sembahyang terdekat
        di sekitarmu dalam sekejap.
      </p>
      <div className="cta-buttons">
        <Link href="/katalog" className="btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}>
          🛍️ Jelajahi Katalog
        </Link>
        <Link href="/mitra" className="btn-ghost" style={{ background: "white", padding: "1rem 2.5rem", borderRadius: "100px", color: "var(--bata)", border: "1px solid rgba(184, 74, 42, 0.2)" }}>
          🏪 Daftar sebagai Penjual
        </Link>
      </div>
    </section>
  );
}
