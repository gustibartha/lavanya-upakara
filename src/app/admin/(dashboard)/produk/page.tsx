import { db } from "@/db";
import { products, stores } from "@/db/schema";
import { desc } from "drizzle-orm";
import { categories } from "@/lib/data";
import { ProdukManager } from "@/components/admin/ProdukManager";

export default async function AdminProdukPage() {
  const [daftarProduk, daftarToko] = await Promise.all([
    db.query.products.findMany({
      orderBy: [desc(products.created_at)],
      with: { store: true },
    }),
    db.select().from(stores),
  ]);

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Kelola Produk</h1>
      <p className="admin-page-sub">
        Satu pintu untuk menambah, mengubah, dan menonaktifkan produk —
        menggantikan skrip seed yang menghapus seluruh riwayat pesanan
        setiap kali dijalankan.
      </p>

      <ProdukManager
        produkAwal={daftarProduk}
        daftarToko={daftarToko}
        daftarKategori={categories.map((k) => ({
          slug: k.slug,
          nama: k.nama,
        }))}
      />
    </div>
  );
}
