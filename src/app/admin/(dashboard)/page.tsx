import Link from "next/link";
import { db } from "@/db";
import { products, orders, stores, partnerApplications, articles } from "@/db/schema";
import { eq, count, sum } from "drizzle-orm";
import { formatRupiah } from "@/lib/data";

const STATUS_URUTAN = ["menunggu", "diproses", "dikirim", "selesai"] as const;
const STATUS_LABEL: Record<string, string> = {
  menunggu: "Menunggu",
  diproses: "Diproses",
  dikirim: "Dikirim",
  selesai: "Selesai",
};

export default async function AdminDashboardPage() {
  const [
    [produkAktif],
    [totalProduk],
    [totalToko],
    [pesananMenunggu],
    [pesananSelesai],
    [pendapatan],
    [mitraBaru],
    [artikelTerbit],
    statusRows,
    pesananTerbaru,
    mitraTerbaru,
  ] = await Promise.all([
    db.select({ n: count() }).from(products).where(eq(products.aktif, true)),
    db.select({ n: count() }).from(products),
    db.select({ n: count() }).from(stores),
    db.select({ n: count() }).from(orders).where(eq(orders.status, "menunggu")),
    db.select({ n: count() }).from(orders).where(eq(orders.status, "selesai")),
    db
      .select({ total: sum(orders.total_harga) })
      .from(orders)
      .where(eq(orders.status_bayar, "dibayar")),
    db
      .select({ n: count() })
      .from(partnerApplications)
      .where(eq(partnerApplications.status, "baru")),
    db.select({ n: count() }).from(articles).where(eq(articles.aktif, true)),
    db.select({ status: orders.status, n: count() }).from(orders).groupBy(orders.status),
    db.query.orders.findMany({
      orderBy: (o, { desc }) => [desc(o.created_at)],
      limit: 5,
      with: { store: true },
    }),
    db.query.partnerApplications.findMany({
      where: (p, { eq }) => eq(p.status, "baru"),
      orderBy: (p, { desc }) => [desc(p.created_at)],
      limit: 3,
    }),
  ]);

  const totalPesanan = statusRows.reduce((acc, r) => acc + r.n, 0);
  const pendapatanTotal = Number(pendapatan.total ?? 0);

  return (
    <div className="admin-page">
      <div className="admin-dash-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub" style={{ marginBottom: 0 }}>
            Ringkasan aktivitas toko Anda hari ini.
          </p>
        </div>
        <Link href="/admin" className="admin-refresh-btn">
          🔄 Segarkan
        </Link>
      </div>

      <div className="admin-stat-grid admin-stat-grid-wide">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">🛍️</div>
          <div>
            <div className="admin-stat-num">{produkAktif.n}</div>
            <div className="admin-stat-label">Produk Aktif</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📦</div>
          <div>
            <div className="admin-stat-num">{totalProduk.n - produkAktif.n}</div>
            <div className="admin-stat-label">Produk Nonaktif</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">🏪</div>
          <div>
            <div className="admin-stat-num">{totalToko.n}</div>
            <div className="admin-stat-label">Toko Terdaftar</div>
          </div>
        </div>
        <div className="admin-stat-card admin-stat-highlight">
          <div className="admin-stat-icon">⏳</div>
          <div>
            <div className="admin-stat-num">{pesananMenunggu.n}</div>
            <div className="admin-stat-label">Pesanan Menunggu Konfirmasi</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">✅</div>
          <div>
            <div className="admin-stat-num">{pesananSelesai.n}</div>
            <div className="admin-stat-label">Pesanan Selesai</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">💰</div>
          <div>
            <div className="admin-stat-num admin-stat-num-small">{formatRupiah(pendapatanTotal)}</div>
            <div className="admin-stat-label">Pendapatan (Lunas via Midtrans)</div>
          </div>
        </div>
        {mitraBaru.n > 0 && (
          <Link href="/admin/mitra" className="admin-stat-card admin-stat-highlight admin-stat-link">
            <div className="admin-stat-icon">🤝</div>
            <div>
              <div className="admin-stat-num">{mitraBaru.n}</div>
              <div className="admin-stat-label">Pengajuan Mitra Baru</div>
            </div>
          </Link>
        )}
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📖</div>
          <div>
            <div className="admin-stat-num">{artikelTerbit.n}</div>
            <div className="admin-stat-label">Artikel Terbit</div>
          </div>
        </div>
      </div>

      <div className="admin-dash-grid">
        <div className="admin-dash-panel">
          <h2 className="admin-dash-panel-title">Status Pesanan</h2>
          {totalPesanan === 0 ? (
            <p className="admin-table-empty" style={{ padding: "1.5rem 0" }}>
              Belum ada pesanan masuk.
            </p>
          ) : (
            <div className="admin-status-bars">
              {STATUS_URUTAN.map((status) => {
                const jumlah = statusRows.find((r) => r.status === status)?.n ?? 0;
                const persen = totalPesanan > 0 ? Math.round((jumlah / totalPesanan) * 100) : 0;
                return (
                  <div className="admin-status-bar-row" key={status}>
                    <span className="admin-status-bar-label">{STATUS_LABEL[status] ?? status}</span>
                    <div className="admin-status-bar-track">
                      <div
                        className={`admin-status-bar-fill admin-status-bar-${status}`}
                        style={{ width: `${persen}%` }}
                      />
                    </div>
                    <span className="admin-status-bar-num">{jumlah}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="admin-dash-panel">
          <h2 className="admin-dash-panel-title">Pesanan Terbaru</h2>
          {pesananTerbaru.length === 0 ? (
            <p className="admin-table-empty" style={{ padding: "1.5rem 0" }}>
              Belum ada pesanan.
            </p>
          ) : (
            <ul className="admin-activity-list">
              {pesananTerbaru.map((o) => (
                <li key={o.id} className="admin-activity-item">
                  <div>
                    <div className="admin-activity-title">{o.store?.nama_toko ?? "Toko"}</div>
                    <div className="admin-activity-sub">
                      {new Date(o.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="admin-activity-right">
                    <div className="admin-activity-amount">{formatRupiah(o.total_harga)}</div>
                    <span className={`admin-badge admin-badge-status-${o.status}`}>
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {mitraTerbaru.length > 0 && (
          <div className="admin-dash-panel admin-dash-panel-full">
            <div className="admin-dash-panel-header">
              <h2 className="admin-dash-panel-title">Pengajuan Mitra Menunggu Ditinjau</h2>
              <Link href="/admin/mitra" className="admin-link-btn">
                Lihat semua →
              </Link>
            </div>
            <ul className="admin-activity-list">
              {mitraTerbaru.map((p) => (
                <li key={p.id} className="admin-activity-item">
                  <div>
                    <div className="admin-activity-title">{p.nama_toko}</div>
                    <div className="admin-activity-sub">{p.nama_pemilik} · {p.whatsapp}</div>
                  </div>
                  <Link href="/admin/mitra" className="admin-badge">
                    Tinjau
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="admin-quick-actions">
        <Link href="/admin/produk" className="btn-primary">
          🛍️ Kelola Produk
        </Link>
        <Link href="/admin/artikel" className="btn-outline">
          📖 Kelola Artikel
        </Link>
        <Link href="/admin/mitra" className="btn-outline">
          🤝 Pengajuan Mitra
        </Link>
      </div>
    </div>
  );
}
