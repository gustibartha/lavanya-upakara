"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/data";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          const found = data.orders.find((o: any) => o.id === id);
          setOrder(found);
        }
      })
      .catch((err) => console.error("Error fetching order:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const steps = [
    { key: "menunggu", label: "Pesanan Dibuat", desc: "Menunggu konfirmasi dari toko", emoji: "📝" },
    { key: "diproses", label: "Pesanan Diproses", desc: "Toko sedang menyiapkan barang Anda", emoji: "👨‍🍳" },
    { key: "dikirim", label: "Dalam Pengiriman", desc: "Kurir sedang menuju alamat Anda", emoji: "🛵" },
    { key: "selesai", label: "Pesanan Selesai", desc: "Barang sudah diterima dengan baik", emoji: "✅" },
  ];

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    const idx = steps.findIndex(s => s.key === order.status);
    return idx === -1 ? 0 : idx;
  };

  if (loading) return <div className="py-20 text-center">Memuat...</div>;
  if (!order) return <div className="py-20 text-center">Pesanan tidak ditemukan</div>;

  return (
    <>
      <Navbar />
      <main className="tracking-page py-20 min-h-screen bg-krem-light">
        <div className="container max-w-4xl">
          <Link href="/riwayat" className="mb-6 inline-block text-bata hover:underline">← Kembali ke Riwayat</Link>
          
          <div className="tracking-card bg-white rounded-3xl shadow-lg p-8">
            <div className="tracking-header border-b pb-6 mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">Detail Pesanan</h1>
                <p className="text-muted">ID Pesanan: #{order.id.split('-')[0].toUpperCase()}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-bata text-xl">{formatRupiah(order.total_harga)}</div>
                <p className="text-sm text-muted">{new Date(order.created_at).toLocaleString('id-ID')}</p>
              </div>
            </div>

            {/* Tracking Progress */}
            <div className="tracking-progress mb-12">
              <h2 className="text-lg font-bold mb-8">Status Pengiriman</h2>
              <div className="tracking-steps">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= getCurrentStepIndex();
                  const isCurrent = idx === getCurrentStepIndex();
                  
                  return (
                    <div key={step.key} className={`tracking-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                      <div className="step-icon">
                        <span className="step-emoji">{step.emoji}</span>
                        {idx < steps.length - 1 && <div className="step-line"></div>}
                      </div>
                      <div className="step-content">
                        <h3 className="font-bold">{step.label}</h3>
                        <p className="text-sm text-muted">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Items */}
              <div className="order-details-section">
                <h2 className="text-lg font-bold mb-4">Produk yang Dibeli</h2>
                <div className="order-items-list space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center bg-krem-light p-4 rounded-2xl">
                      <div>
                        <div className="font-bold">{item.product?.nama_produk}</div>
                        <div className="text-sm text-muted">{formatRupiah(item.harga_satuan)} x {item.jumlah}</div>
                      </div>
                      <div className="font-bold">{formatRupiah(item.harga_satuan * item.jumlah)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="shipping-details-section">
                <h2 className="text-lg font-bold mb-4">Alamat Pengiriman</h2>
                <div className="bg-krem-light p-6 rounded-2xl">
                  <div className="font-bold mb-1">{order.store?.nama_toko}</div>
                  <p className="text-sm text-muted mb-4">Dari: {order.store?.alamat}</p>
                  
                  <div className="font-bold mb-1">Penerima</div>
                  <p className="text-sm">{order.jalan}</p>
                  <p className="text-sm">{order.kelurahan}, {order.kecamatan}</p>
                  <p className="text-sm">{order.kota}, {order.provinsi}</p>
                  <p className="text-sm">{order.kodepos}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs font-bold text-muted uppercase">Metode Pengiriman</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span>{order.shipping_method === 'pickup' ? '🏪 Ambil Sendiri' : '🛵 Pengiriman'}</span>
                      {order.shipping_service && (
                        <span className="bg-bata text-white text-[10px] px-2 py-0.5 rounded-full capitalize">
                          {order.shipping_service}
                        </span>
                      )}
                    </div>
                  </div>
                  {order.catatan && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-xs font-bold text-muted uppercase">Catatan</div>
                      <p className="text-sm italic">"{order.catatan}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
