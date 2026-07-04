"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { formatRupiah } from "@/lib/data";
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Star,
  MapPin,
  Phone,
  Store,
  ChevronLeft,
  Copy,
  Check,
} from "lucide-react";

type OrderStatus = "menunggu" | "diproses" | "dikirim" | "selesai";

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ElementType; desc: string }[] = [
  { key: "menunggu", label: "Pesanan Dibuat", icon: Clock, desc: "Pesanan Anda sedang menunggu konfirmasi dari toko" },
  { key: "diproses", label: "Sedang Diproses", icon: Package, desc: "Toko sedang menyiapkan pesanan Anda" },
  { key: "dikirim", label: "Dalam Pengiriman", icon: Truck, desc: "Kurir sedang mengirimkan pesanan ke alamat Anda" },
  { key: "selesai", label: "Pesanan Selesai", icon: Star, desc: "Pesanan berhasil diterima. Terima kasih! 🙏" },
];

const STATUS_ORDER: OrderStatus[] = ["menunggu", "diproses", "dikirim", "selesai"];

function getStepIndex(status: OrderStatus) {
  return STATUS_ORDER.indexOf(status);
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
        else setError("Pesanan tidak ditemukan");
      })
      .catch(() => setError("Gagal memuat data pesanan"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(id || "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const kuriirEmoji: Record<string, string> = {
    gojek: "🟢",
    grab: "🟩",
    paxel: "📦",
  };

  const currentStepIndex = order ? getStepIndex(order.status as OrderStatus) : 0;

  return (
    <>
      <Navbar />
      <main className="order-detail-page">
        <div className="container">
          {/* Back */}
          <Link href="/riwayat" className="order-back-link">
            <ChevronLeft size={18} /> Kembali ke Riwayat
          </Link>

          {loading ? (
            <div className="order-detail-loading">
              <div className="loading-spinner-lg">⏳</div>
              <p>Memuat detail pesanan...</p>
            </div>
          ) : error ? (
            <div className="order-detail-error">
              <div style={{ fontSize: "3rem" }}>😔</div>
              <h2>{error}</h2>
              <Link href="/riwayat" className="btn btn-primary">Kembali</Link>
            </div>
          ) : order ? (
            <div className="order-detail-grid">
              {/* LEFT */}
              <div className="order-detail-main">
                {/* Header */}
                <div className="order-detail-header-card">
                  <div className="order-detail-id-row">
                    <div>
                      <div className="order-detail-label">Nomor Pesanan</div>
                      <div className="order-detail-id">#{id?.split("-").slice(0, 2).join("-").toUpperCase()}</div>
                    </div>
                    <button className="order-copy-btn" onClick={handleCopyId} title="Salin ID">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copied ? "Tersalin!" : "Salin"}</span>
                    </button>
                  </div>
                  <div className="order-detail-date">
                    🗓️ {new Date(order.created_at).toLocaleDateString("id-ID", {
                      weekday: "long", day: "numeric", month: "long", year: "numeric",
                    })}
                    {" "}· {new Date(order.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit", minute: "2-digit",
                    })} WITA
                  </div>
                </div>

                {/* === DELIVERY TIMELINE === */}
                <div className="delivery-timeline-card">
                  <h2 className="delivery-timeline-title">
                    <Truck size={20} /> Status Pengiriman
                  </h2>

                  <div className="delivery-timeline">
                    {STATUS_STEPS.map((step, idx) => {
                      const done = idx <= currentStepIndex;
                      const active = idx === currentStepIndex;
                      const Icon = step.icon;
                      return (
                        <div key={step.key} className={`timeline-step ${done ? "done" : ""} ${active ? "active" : ""}`}>
                          <div className="timeline-step-indicator">
                            <div className={`timeline-dot ${done ? "done" : ""} ${active ? "active" : ""}`}>
                              {done && !active ? (
                                <CheckCircle2 size={18} />
                              ) : (
                                <Icon size={18} />
                              )}
                            </div>
                            {idx < STATUS_STEPS.length - 1 && (
                              <div className={`timeline-line ${idx < currentStepIndex ? "done" : ""}`} />
                            )}
                          </div>
                          <div className="timeline-step-content">
                            <div className={`timeline-step-label ${active ? "active" : ""}`}>{step.label}</div>
                            {active && (
                              <div className="timeline-step-desc">{step.desc}</div>
                            )}
                            {active && (
                              <div className="timeline-step-time">
                                {new Date(order.created_at).toLocaleTimeString("id-ID", {
                                  hour: "2-digit", minute: "2-digit",
                                })} WITA
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Kurir Info */}
                  {order.shipping_method === "delivery" && order.shipping_service && (
                    <div className="delivery-kurir-info">
                      <span className="kurir-emoji">{kuriirEmoji[order.shipping_service] || "🛵"}</span>
                      <div>
                        <div className="kurir-label">Layanan Kurir</div>
                        <div className="kurir-name">{order.shipping_service.charAt(0).toUpperCase() + order.shipping_service.slice(1)}</div>
                      </div>
                      <div className="kurir-badge">
                        {order.status === "dikirim" ? "Sedang antar" : order.status === "selesai" ? "Terkirim ✓" : "Menunggu pickup"}
                      </div>
                    </div>
                  )}
                  {order.shipping_method === "pickup" && (
                    <div className="delivery-kurir-info">
                      <span className="kurir-emoji">🏪</span>
                      <div>
                        <div className="kurir-label">Metode</div>
                        <div className="kurir-name">Ambil di Toko</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Alamat */}
                {order.shipping_method === "delivery" && order.jalan && (
                  <div className="order-detail-card">
                    <h3 className="order-detail-card-title">
                      <MapPin size={18} /> Alamat Pengiriman
                    </h3>
                    <div className="order-address-block">
                      <div className="order-address-line">{order.jalan}</div>
                      <div className="order-address-line muted">
                        {[order.kelurahan, order.kecamatan, order.kota, order.provinsi]
                          .filter(Boolean)
                          .join(", ")}
                        {order.kodepos ? ` ${order.kodepos}` : ""}
                      </div>
                    </div>
                  </div>
                )}

                {/* Catatan */}
                {order.catatan && (
                  <div className="order-detail-card">
                    <h3 className="order-detail-card-title">📝 Catatan Pesanan</h3>
                    <p className="order-catatan">{order.catatan}</p>
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div className="order-detail-sidebar">
                {/* Store Info */}
                {order.store && (
                  <div className="order-detail-card">
                    <h3 className="order-detail-card-title">
                      <Store size={18} /> Informasi Toko
                    </h3>
                    <div className="order-store-info">
                      <div className="order-store-icon">{order.store.emoji || "🏪"}</div>
                      <div>
                        <div className="order-store-name">{order.store.nama_toko}</div>
                        <div className="order-store-address muted">{order.store.alamat}</div>
                      </div>
                    </div>
                    {order.store.telepon && (
                      <a
                        href={`https://wa.me/62${order.store.telepon.replace(/^0/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="order-wa-btn"
                      >
                        <Phone size={16} />
                        Hubungi via WhatsApp
                      </a>
                    )}
                    {!order.store.telepon && (
                      <a href="/toko" className="order-wa-btn">
                        <MapPin size={16} />
                        Lihat Lokasi Toko
                      </a>
                    )}
                  </div>
                )}

                {/* Items */}
                <div className="order-detail-card">
                  <h3 className="order-detail-card-title">
                    <Package size={18} /> Item Pesanan
                  </h3>
                  <div className="order-items-list">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="order-item-row">
                        <div className="order-item-emoji">
                          {item.product?.emoji || "📦"}
                        </div>
                        <div className="order-item-info">
                          <div className="order-item-name">
                            {item.product?.nama_produk || "Produk"}
                          </div>
                          <div className="order-item-qty">
                            {item.jumlah}x · {formatRupiah(item.harga_satuan)}
                          </div>
                        </div>
                        <div className="order-item-subtotal">
                          {formatRupiah(item.jumlah * item.harga_satuan)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="order-total-divider" />
                  <div className="order-grand-total-row">
                    <div>
                      <div className="order-total-label">Total Pembayaran</div>
                      <div className="order-payment-method">
                        Bayar di Tempat (COD)
                      </div>
                    </div>
                    <div className="order-grand-total">{formatRupiah(order.total_harga)}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="order-detail-actions">
                  {order.status === "selesai" && (
                    <Link href="/katalog" className="btn btn-primary w-full">
                      🛍️ Pesan Lagi
                    </Link>
                  )}
                  <Link href="/katalog" className="btn btn-outline w-full">
                    Lanjut Belanja
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
