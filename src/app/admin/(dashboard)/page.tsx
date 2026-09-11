import Link from "next/link";
import { db } from "@/db";
import { products, orders } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export default async function AdminDashboardPage() {
  const [[produkAktif], [pesananMenunggu], [totalProduk]] = await Promise.all([
    db.select({ n: count() }).from(products).where(eq(products.aktif, true)),
    db.select({ n: count() }).from(orders).where(eq(orders.status, "menunggu")),
    db.select({ n: count() }).from(products),
  ]);

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Dashboard</h1>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-num">{produkAktif.n}</div>
          <div className="admin-stat-label">Produk Aktif</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-num">{totalProduk.n - produkAktif.n}</div>
          <div className="admin-stat-label">Produk Nonaktif</div>
        </div>
        <div className="admin-stat-card admin-stat-highlight">
          <div className="admin-stat-num">{pesananMenunggu.n}</div>
          <div className="admin-stat-label">Pesanan Menunggu Konfirmasi</div>
        </div>
      </div>

      <div className="admin-quick-actions">
        <Link href="/admin/produk" className="btn-primary">
          🛍️ Kelola Produk
        </Link>
      </div>
    </div>
  );
}
