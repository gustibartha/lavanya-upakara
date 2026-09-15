import { db } from "@/db";
import { partnerApplications } from "@/db/schema";
import { desc } from "drizzle-orm";
import { MitraManager } from "@/components/admin/MitraManager";

export default async function AdminMitraPage() {
  const rows = await db
    .select()
    .from(partnerApplications)
    .orderBy(desc(partnerApplications.created_at));

  // kategori disimpan sebagai JSON array of string — diparse di sini supaya
  // komponen tidak perlu tahu detail penyimpanannya.
  const daftarPengajuan = rows.map((p) => {
    let kategori: string[];
    try {
      kategori = JSON.parse(p.kategori);
    } catch {
      kategori = [p.kategori];
    }
    return { ...p, kategori };
  });

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Pengajuan Mitra</h1>
      <p className="admin-page-sub">
        Daftar toko yang mengajukan diri menjadi mitra lewat halaman
        pendaftaran. Verifikasi foto KTP dan foto toko dilakukan lewat
        WhatsApp — di sini Anda mencatat hasilnya dan, kalau disetujui,
        langsung membuat entri toko.
      </p>

      <MitraManager pengajuanAwal={daftarPengajuan} />
    </div>
  );
}
