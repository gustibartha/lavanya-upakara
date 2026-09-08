"use client";

import { useState } from "react";
import Script from "next/script";

const CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
const SNAP_URL =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

interface Props {
  orderId: string;
  /** Dipanggil setelah Snap ditutup, agar halaman memuat ulang statusnya. */
  onFinished?: () => void;
  label?: string;
}

/**
 * Tombol untuk melunasi pesanan yang belum dibayar.
 *
 * Statusnya tidak pernah diubah dari sini — pelunasan ditentukan webhook
 * Midtrans di server. Tombol ini hanya membuka Snap lalu meminta halaman
 * memuat ulang data pesanan.
 */
export function MidtransPayButton({ orderId, onFinished, label }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tanpa Client Key, Snap tidak bisa dibuka — tombolnya tidak ditampilkan
  // sama sekali daripada menuntun ke jalan buntu.
  if (!CLIENT_KEY) return null;

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/midtrans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
      const data = await res.json();

      if (!res.ok || !data.token) {
        setError(data.error || "Gagal membuka halaman pembayaran");
        return;
      }

      if (!window.snap) {
        window.location.href = data.redirect_url;
        return;
      }

      window.snap.pay(data.token, {
        onSuccess: () => onFinished?.(),
        onPending: () => onFinished?.(),
        onError: () => setError("Pembayaran gagal. Silakan coba lagi."),
        onClose: () => onFinished?.(),
      });
    } catch {
      setError("Koneksi ke pembayaran gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src={SNAP_URL} data-client-key={CLIENT_KEY} strategy="afterInteractive" />
      <button
        className="btn btn-primary w-full"
        onClick={handlePay}
        disabled={loading}
      >
        {loading ? "Menyiapkan pembayaran..." : label || "💳 Bayar Sekarang"}
      </button>
      {error && <p className="payment-error">{error}</p>}
    </>
  );
}
