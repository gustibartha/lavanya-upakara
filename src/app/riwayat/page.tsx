"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/data";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function RiwayatPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "menunggu": return "Menunggu Konfirmasi";
      case "diproses": return "Sedang Diproses";
      case "dikirim": return "Dalam Pengiriman";
      case "selesai": return "Pesanan Selesai";
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "menunggu": return "status-pending";
      case "diproses": return "status-process";
      case "dikirim": return "status-shipping";
      case "selesai": return "status-done";
      default: return "";
    }
  };

  return (
    <>
      <Navbar />
      <main className="riwayat-page py-20 min-h-screen bg-krem-light">
        <div className="container">
          <div className="riwayat-header mb-10">
            <h1 className="section-title text-left">Riwayat Pesanan</h1>
            <p className="section-subtitle text-left">Pantau status belanja sarana sembahyang Anda</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="loading-spinner">⏳</div>
              <p className="mt-4">Memuat riwayat pesanan...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-orders text-center py-20 bg-white rounded-3xl shadow-sm">
              <div className="empty-emoji text-6xl mb-6">🛍️</div>
              <h3>Belum ada pesanan</h3>
              <p className="text-muted mb-8">Anda belum pernah melakukan pemesanan sebelumnya.</p>
              <Link href="/katalog" className="btn-primary">Mulai Belanja</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card anim-fadeup">
                  <div className="order-card-header">
                    <div className="order-meta">
                      <span className="order-date">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span className="order-id">#{order.id.split('-')[0].toUpperCase()}</span>
                    </div>
                    <div className={`order-status ${getStatusClass(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </div>
                  </div>

                  <div className="order-card-body">
                    <div className="order-store">
                      <span className="store-emoji">{order.store?.emoji || "🏪"}</span>
                      <span className="store-name">{order.store?.nama_toko}</span>
                    </div>
                    
                    <div className="order-items-preview">
                      {order.items.slice(0, 2).map((item: any, idx: number) => (
                        <div key={idx} className="item-row">
                          <span className="item-name">{item.product?.nama_produk}</span>
                          <span className="item-qty">x{item.jumlah}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="item-more text-muted">+{order.items.length - 2} produk lainnya</div>
                      )}
                    </div>

                    <div className="order-total-section">
                      <div className="total-label">Total Pembayaran</div>
                      <div className="total-amount">{formatRupiah(order.total_harga)}</div>
                    </div>
                  </div>

                  <div className="order-card-footer">
                    <Link href={`/riwayat/${order.id}`} className="btn-ghost btn-sm">Detail & Tracking</Link>
                    {order.status === 'selesai' && (
                      <button className="btn-primary btn-sm">Beli Lagi</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
