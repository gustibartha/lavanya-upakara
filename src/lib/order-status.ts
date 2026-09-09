// ==========================================
// Label status pesanan & pembayaran
// ==========================================
// Dipakai bersama halaman Riwayat dan Detail Pesanan agar istilahnya sama.

/** Status pesanan — sejauh mana toko memproses barangnya. */
export const ORDER_STATUS: Record<string, { label: string; className: string }> = {
  menunggu: { label: "Menunggu Konfirmasi", className: "status-pending" },
  diproses: { label: "Sedang Diproses", className: "status-process" },
  dikirim: { label: "Dalam Pengiriman", className: "status-shipping" },
  selesai: { label: "Pesanan Selesai", className: "status-done" },
};

/** Status pembayaran — apakah dananya sudah diterima. Terpisah dari status
 *  pesanan, karena pesanan COD bisa diproses meski belum dibayar. */
export const PAYMENT_STATUS: Record<string, { label: string; className: string }> = {
  belum_bayar: { label: "Belum Dibayar", className: "pay-unpaid" },
  pending: { label: "Menunggu Pembayaran", className: "pay-pending" },
  dibayar: { label: "Lunas", className: "pay-paid" },
  gagal: { label: "Pembayaran Gagal", className: "pay-failed" },
  kadaluarsa: { label: "Pembayaran Kedaluwarsa", className: "pay-failed" },
  refund: { label: "Dana Dikembalikan", className: "pay-refund" },
};

/** Nama ramah untuk payment_type yang dikirim Midtrans. */
export const PAYMENT_TYPE_LABEL: Record<string, string> = {
  qris: "QRIS",
  bank_transfer: "Transfer Bank (VA)",
  echannel: "Mandiri Bill",
  permata: "Permata VA",
  gopay: "GoPay",
  shopeepay: "ShopeePay",
  credit_card: "Kartu Kredit",
  cstore: "Gerai Retail",
  akulaku: "Akulaku",
};

/** Pesanan online yang dananya belum masuk masih boleh dibayar ulang. */
export const PAYABLE = new Set(["belum_bayar", "pending", "gagal", "kadaluarsa"]);

/** Nomor pesanan yang enak dibaca. Id aslinya berbentuk "order-a1b2c3d4",
 *  jadi memotong di tanda hubung pertama hanya menghasilkan kata "ORDER". */
export function nomorPesanan(id: string) {
  return id.replace(/^order-/, "").toUpperCase();
}

/** Metode bayar untuk ditampilkan. */
export function labelMetodeBayar(metode?: string, paymentType?: string | null) {
  if (metode !== "midtrans") return "Bayar di Tempat (COD)";
  return (paymentType && PAYMENT_TYPE_LABEL[paymentType]) || "Pembayaran Online";
}
