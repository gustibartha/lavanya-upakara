// ==========================================
// Ongkos kirim otomatis berdasarkan jarak
// ==========================================
// Pembeli membayar barang + ongkir sekaligus di depan; admin lalu memesan
// GoSend/GrabExpress memakai saldo Lavanya. Dihitung ulang di server saat
// pesanan dibuat — angka dari browser hanya untuk ditampilkan.

/** Tarif per km jalan (rupiah). */
export const TARIF_PER_KM = 2_500;
/** Ongkir minimum (rupiah). */
export const ONGKIR_MINIMUM = 10_000;
/** Di atas jarak ini (km jalan) pengiriman tidak dilayani — pilih ambil di toko. */
export const JARAK_MAKS_KM = 40;
/** Jarak garis lurus × faktor ini ≈ jarak tempuh di jalan dalam kota. */
const FAKTOR_JALAN = 1.3;

/** Jarak garis lurus dua titik (km), rumus haversine. */
export function jarakKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface HasilOngkir {
  jarak_km: number;
  ongkir: number;
  terjangkau: boolean;
}

/** Ongkir dari toko ke titik antar: Rp 2.500/km jalan, minimal Rp 10.000,
 *  dibulatkan ke atas per Rp 500. */
export function hitungOngkir(
  toko: { lat: number; lng: number },
  tujuan: { lat: number; lng: number },
): HasilOngkir {
  const jalan = jarakKm(toko.lat, toko.lng, tujuan.lat, tujuan.lng) * FAKTOR_JALAN;
  const ongkir = Math.max(ONGKIR_MINIMUM, Math.ceil((jalan * TARIF_PER_KM) / 500) * 500);
  return {
    jarak_km: Math.round(jalan * 10) / 10,
    ongkir,
    terjangkau: jalan <= JARAK_MAKS_KM,
  };
}
