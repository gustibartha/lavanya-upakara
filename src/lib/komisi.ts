// ==========================================
// Komisi platform
// ==========================================
// Komisi hanya berlaku untuk pembayaran online (Midtrans) yang sudah lunas.
// Uang dari pesanan COD dibayar tunai langsung ke toko dan tidak pernah
// melewati sistem kami, jadi tidak ada yang bisa dipotong dari situ.

/**
 * Tarif komisi platform, dalam persen. Dibaca dari environment variable
 * supaya bisa diubah tanpa mengubah kode — tapi karena bukan variabel
 * NEXT_PUBLIC_, perubahannya tetap butuh redeploy, sama seperti variabel
 * Midtrans lainnya di proyek ini.
 *
 * Default 5% dipakai kalau variabelnya tidak diisi, mengikuti angka yang
 * sudah diputuskan saat fitur ini dibangun — bukan tebakan sembarangan.
 */
export function getKomisiPersen(): number {
  const raw = process.env.PLATFORM_KOMISI_PERSEN?.trim();
  if (!raw) return 5;

  const persen = Number(raw);
  if (!Number.isFinite(persen) || persen < 0 || persen > 100) {
    console.error(
      `PLATFORM_KOMISI_PERSEN="${raw}" tidak valid (harus angka 0-100). Memakai default 5%.`,
    );
    return 5;
  }
  return persen;
}

/**
 * Menghitung nominal komisi dari total pesanan, dibulatkan ke Rupiah
 * terdekat. Dipanggil sekali saat pesanan menjadi lunas — hasilnya dikunci
 * di kolom komisi_persen/komisi_nominal pada pesanan itu, tidak dihitung
 * ulang otomatis kalau tarifnya berubah di kemudian hari.
 */
export function hitungKomisi(totalHarga: number, persen: number) {
  return Math.round((totalHarga * persen) / 100);
}
