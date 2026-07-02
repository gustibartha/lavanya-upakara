export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Ni Wayan Suartini",
      role: "Pembeli",
      avatar: "👩",
      text: "Lavanya Upakara sangat membantu! Dulu sering kehabisan banten kalau pesan mendadak untuk rerahinan, sekarang tinggal cari toko terdekat di aplikasi ini.",
      rating: 5,
    },
    {
      id: 2,
      name: "Jro Mangku Alit",
      role: "Pemangku",
      avatar: "👳",
      text: "Kualitas perlengkapan dari toko-toko yang terdaftar di sini sangat baik. Harga transparan dan bisa pesan antar sangat memudahkan umat.",
      rating: 5,
    },
    {
      id: 3,
      name: "Toko Sari Ayu",
      role: "Penjual",
      avatar: "🏪",
      text: "Sejak bergabung dengan platform ini, penjualan canang dan dupa saya meningkat drastis. Pelanggan lebih mudah menemukan toko saya.",
      rating: 5,
    },
  ];

  return (
    <section className="testimonials-section container" id="testimoni">
      <div className="section-header text-center anim-fadeup">
        <div className="section-tag" style={{ justifyContent: "center" }}>Ulasan Pelanggan</div>
        <h2 className="section-title">Apa Kata Mereka?</h2>
        <p className="section-sub mx-auto" style={{ maxWidth: "600px" }}>
          Kepercayaan umat dan kesejahteraan pedagang adalah prioritas utama kami.
        </p>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((testi, i) => (
          <div key={testi.id} className={`testi-card anim-fadeup stagger-${i + 1}`}>
            <div className="testi-stars">
              {"★".repeat(testi.rating)}
            </div>
            <p className="testi-text">"{testi.text}"</p>
            <div className="testi-user">
              <div className="testi-avatar">{testi.avatar}</div>
              <div className="testi-info">
                <h4>{testi.name}</h4>
                <span>{testi.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
