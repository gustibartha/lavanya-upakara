// ==========================================
// Menerapkan status pembayaran Midtrans ke sebuah pesanan
// ==========================================
// Dipakai oleh dua jalur yang keduanya bisa jadi sumber kebenaran soal
// status pembayaran: webhook Midtrans (pasif, menunggu dikirimi), dan
// endpoint sinkronisasi (aktif, kita yang bertanya ke Midtrans). Disatukan
// di sini supaya keduanya menerapkan aturan yang sama persis — kalau
// aturannya beda, satu pesanan bisa terlihat lunas di satu jalur dan belum
// di jalur lain.

import { db } from "@/db";
import { orders, type Order } from "@/db/schema";
import { eq } from "drizzle-orm";
import { mapTransactionStatus } from "@/lib/midtrans";
import { getKomisiPersen, hitungKomisi } from "@/lib/komisi";

export interface StatusMidtrans {
  transaction_status: string;
  fraud_status?: string;
  transaction_id?: string;
  payment_type?: string;
  settlement_time?: string;
  transaction_time?: string;
}

/**
 * Menulis status pembayaran terbaru ke database, mengikuti aturan yang
 * sama dengan webhook. Tidak melakukan apa-apa (dan memberi tahu lewat
 * `changed: false`) kalau pesanan sudah lunas dan status barunya bukan
 * refund — pesanan yang sudah lunas hanya boleh berubah lewat refund.
 */
export async function applyMidtransStatus(order: Order, info: StatusMidtrans) {
  const statusBayar = mapTransactionStatus(
    info.transaction_status ?? "",
    info.fraud_status,
  );

  if (order.status_bayar === "dibayar" && statusBayar !== "refund") {
    return { changed: false as const, statusBayar: order.status_bayar };
  }

  const paidAt =
    statusBayar === "dibayar"
      ? info.settlement_time ?? info.transaction_time ?? new Date().toISOString()
      : null;

  // Komisi dikunci sekali, tepat saat pesanan pertama kali menjadi lunas —
  // bukan dihitung ulang tiap kali fungsi ini dipanggil (webhook dan sinkron
  // manual bisa sama-sama memanggilnya untuk pesanan yang sama). Guard di
  // atas (`order.status_bayar === "dibayar"` ditolak kecuali refund) sudah
  // memastikan blok ini hanya tercapai pada transisi pertama menuju lunas.
  const jadiLunasSekarang = statusBayar === "dibayar";
  const komisiPersen = jadiLunasSekarang ? getKomisiPersen() : undefined;
  const komisiNominal = jadiLunasSekarang
    ? hitungKomisi(order.total_harga, komisiPersen!)
    : undefined;

  await db
    .update(orders)
    .set({
      status_bayar: statusBayar,
      midtrans_transaction_id: info.transaction_id ?? null,
      payment_type: info.payment_type ?? null,
      paid_at: paidAt,
      ...(jadiLunasSekarang
        ? { komisi_persen: komisiPersen, komisi_nominal: komisiNominal }
        : {}),
      // Pesanan baru masuk antrean toko setelah dananya benar-benar diterima.
      ...(statusBayar === "dibayar" && order.status === "menunggu"
        ? { status: "diproses" }
        : {}),
    })
    .where(eq(orders.id, order.id));

  return { changed: true as const, statusBayar };
}
