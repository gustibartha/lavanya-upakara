// ==========================================
// Kontak resmi Lavanya Upakara
// ==========================================
// Dikumpulkan di satu berkas supaya nomor CS tidak tersebar dan
// berbeda-beda antar halaman kalau suatu saat berganti.

/** Nomor CS format internasional tanpa tanda plus — dipakai untuk wa.me. */
export const CS_WHATSAPP = "628991905928";

/** Bentuk yang enak dibaca manusia. */
export const CS_WHATSAPP_DISPLAY = "+62 899-1905-928";

export const CS_EMAIL = "cs@lavanyaupakara.com";

/**
 * Membuat tautan WhatsApp ke CS dengan pesan yang sudah terisi.
 * Teksnya di-encode agar baris baru dan karakter khusus tidak rusak.
 */
export function waLink(pesan?: string) {
  const base = `https://wa.me/${CS_WHATSAPP}`;
  return pesan ? `${base}?text=${encodeURIComponent(pesan)}` : base;
}
