import Link from "next/link";

const WARNA = ["#FBF0DC", "#E4F0EA", "#FAE7E1", "#FBF5DC"];

interface TokoRingkas {
  id: string;
  nama_toko: string;
  alamat: string;
}

export function NearbyStores({ toko }: { toko: TokoRingkas[] }) {
  if (toko.length === 0) return null;

  return (
    <section className="nearby-section container" id="toko">
      <div className="section-row">
        <div className="section-header anim-fadeup" data-reveal="left" style={{ marginBottom: 0 }}>
          <div className="section-tag">Toko Mitra</div>
          <h2 className="section-title">Toko di Sekitarmu</h2>
          <p className="section-sub">Temukan perlengkapan upacara dari toko mitra di Jabodetabek.</p>
        </div>
        <Link href="/toko" className="btn btn-outline anim-fadeup stagger-1" data-reveal="right">
          Lihat Semua Peta
        </Link>
      </div>

      <div className="stores-grid" id="storesGrid">
        {toko.map((store, i) => (
          <Link
            href={`/toko?id=${store.id}`}
            key={store.id}
            className={`store-card anim-fadeup stagger-${(i % 5) + 1}`}
          >
            <div className="store-card-banner" style={{ background: WARNA[i % WARNA.length], padding: 0 }}>
              <img
                src="/images/stores/default-store.png"
                alt={store.nama_toko}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="store-card-body">
              <h3 className="store-name">{store.nama_toko}</h3>
              <div className="store-meta">
                <span className="store-address">📍 {store.alamat}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
