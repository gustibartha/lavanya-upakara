import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ArtikelManager } from "@/components/admin/ArtikelManager";

const KATEGORI_ARTIKEL = ["Edukasi", "Hari Raya", "Tradisi"];

export default async function AdminArtikelPage() {
  const rows = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.created_at));

  // konten disimpan sebagai JSON array of string — diparse di sini supaya
  // komponen form tidak perlu tahu detail penyimpanannya.
  const daftarArtikel = rows.map((a) => {
    let konten: string[];
    try {
      konten = JSON.parse(a.konten);
    } catch {
      konten = [a.konten];
    }
    return { ...a, konten };
  });

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Kelola Artikel</h1>
      <p className="admin-page-sub">
        Tulis dan terbitkan artikel edukasi seputar sarana upacara dan
        tradisi Hindu. Artikel yang dinonaktifkan tersimpan sebagai draf.
      </p>

      <ArtikelManager artikelAwal={daftarArtikel} daftarKategori={KATEGORI_ARTIKEL} />
    </div>
  );
}
