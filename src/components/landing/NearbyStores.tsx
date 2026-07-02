import Link from "next/link";

export function NearbyStores() {
  const stores = [
    { id: 1, name: "Toko Sari Ayu", rating: 4.8, dist: 0.8, emoji: "🏪", color: "#FBF0DC" },
    { id: 2, name: "Baturiti Upakara", rating: 4.9, dist: 1.2, emoji: "🛖", color: "#E4F0EA" },
    { id: 3, name: "Griya Sesajen", rating: 4.7, dist: 2.5, emoji: "🏯", color: "#FAE7E1" },
    { id: 4, name: "Pasar Seni Bali", rating: 4.6, dist: 3.1, emoji: "🎪", color: "#FBF5DC" },
  ];

  return (
    <section className="nearby-section container" id="toko">
      <div className="section-row">
        <div className="section-header anim-fadeup" style={{ marginBottom: 0 }}>
          <div className="section-tag">Lokasi Terdekat</div>
          <h2 className="section-title">Toko di Sekitarmu</h2>
          <p className="section-sub">Temukan perlengkapan upacara dari toko terdekat dengan harga terbaik.</p>
        </div>
        <Link href="/toko" className="btn btn-outline anim-fadeup stagger-1">
          Lihat Semua Peta
        </Link>
      </div>

      <div className="stores-grid" id="storesGrid">
        {stores.map((store, i) => (
          <Link href={`/toko?id=${store.id}`} key={store.id} className={`store-card anim-fadeup stagger-${(i % 5) + 1}`}>
            <div className="store-card-banner" style={{ background: store.color, padding: 0 }}>
              <img src="/images/stores/default-store.png" alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="store-card-body">
              <h3 className="store-name">{store.name}</h3>
              <div className="store-meta">
                <span>⭐ {store.rating}</span>
                <span className="store-dist-badge">📍 {store.dist} km</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
