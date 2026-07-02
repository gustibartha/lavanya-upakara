"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { authClient } from "@/lib/auth-client";
import { formatRupiah } from "@/lib/data";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart, isInitialized } = useCart();
  const { data: session, isPending } = authClient.useSession();

  const [jalan, setJalan] = useState("");
  const [provinces, setProvinces] = useState<any[]>([]);
  const [regencies, setRegencies] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegency, setSelectedRegency] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const [kodepos, setKodepos] = useState("");
  const [shippingMethod, setShippingMethod] = useState("delivery"); // pickup | delivery
  const [shippingService, setShippingService] = useState("gojek"); // gojek | grab | paxel
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  // Fetch Provinces on mount
  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error("Error fetching provinces:", err));
  }, []);

  // Fetch Regencies when province changes
  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince}.json`)
        .then(res => res.json())
        .then(data => setRegencies(data))
        .catch(err => console.error("Error fetching regencies:", err));
    } else {
      setRegencies([]);
    }
    setSelectedRegency("");
    setSelectedDistrict("");
    setSelectedVillage("");
  }, [selectedProvince]);

  // Fetch Districts when regency changes
  useEffect(() => {
    if (selectedRegency) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency}.json`)
        .then(res => res.json())
        .then(data => setDistricts(data))
        .catch(err => console.error("Error fetching districts:", err));
    } else {
      setDistricts([]);
    }
    setSelectedDistrict("");
    setSelectedVillage("");
  }, [selectedRegency]);

  // Fetch Villages when district changes
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistrict}.json`)
        .then(res => res.json())
        .then(data => setVillages(data))
        .catch(err => console.error("Error fetching villages:", err));
    } else {
      setVillages([]);
    }
    setSelectedVillage("");
  }, [selectedDistrict]);

  // Redirect if cart is empty and not just finished an order
  useEffect(() => {
    if (isInitialized && !isPending && cartItems.length === 0 && !orderSuccess) {
      router.push("/katalog");
    }
  }, [cartItems, isPending, orderSuccess, router, isInitialized]);

  const handlePlaceOrder = async () => {
    if (!session) {
      router.push("/masuk?callbackUrl=/checkout");
      return;
    }

    if (shippingMethod === "delivery" && (!jalan.trim() || !selectedProvince || !selectedRegency || !selectedDistrict || !selectedVillage)) {
      alert("Silakan lengkapi alamat pengiriman");
      return;
    }

    setIsSubmitting(true);
    
    // Get names instead of IDs for the order
    const provinceName = provinces.find(p => p.id === selectedProvince)?.name || "";
    const regencyName = regencies.find(r => r.id === selectedRegency)?.name || "";
    const districtName = districts.find(d => d.id === selectedDistrict)?.name || "";
    const villageName = villages.find(v => v.id === selectedVillage)?.name || "";

    try {
      if (cartItems.length === 0) {
        alert("Keranjang Anda kosong");
        return;
      }

      const storeId = cartItems[0].store_id; 
      
      const payload = {
        user_id: session.user.id,
        store_id: storeId,
        items: cartItems.map(item => ({
          product_id: item.id,
          jumlah: item.quantity
        })),
        jalan: shippingMethod === "pickup" ? "Ambil di Toko" : jalan,
        kelurahan: villageName,
        kecamatan: districtName,
        kota: regencyName,
        provinsi: provinceName,
        kodepos,
        shipping_method: shippingMethod,
        shipping_service: shippingMethod === "delivery" ? shippingService : null,
        catatan: note
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setOrderSuccess(data.order);
        clearCart();
      } else {
        alert("Gagal: " + (data.error || "Terjadi kesalahan pada server"));
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="container py-20 text-center">
        <div className="loading-spinner">⏳ Memuat...</div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="container py-20 text-center order-success-page">
        <div className="success-emoji">🙏</div>
        <h1 className="success-title">Pesanan Berhasil!</h1>
        <p className="success-subtitle">
          Terima kasih telah memesan sarana sembahyang di Lavanya Upakara.
          Nomor pesanan Anda: <strong>{orderSuccess.id}</strong>
        </p>
        <div className="success-actions">
          <Link href="/" className="btn-primary">
            Kembali ke Beranda
          </Link>
          <Link href="/katalog" className="btn-ghost">
            Belanja Lagi
          </Link>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container py-20 text-center">
        <h2>Silakan masuk untuk melanjutkan checkout</h2>
        <p className="mb-8 mt-2 text-muted">Anda perlu login agar kami bisa memproses pesanan Anda.</p>
        <Link href="/masuk?callbackUrl=/checkout" className="btn-primary">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page py-12">
      <div className="container">
        <Link href="/katalog" className="text-bata hover:underline mb-4 inline-block">
          ← Kembali ke Katalog
        </Link>
        <h1 className="checkout-title mb-8">Konfirmasi Pesanan</h1>

        <div className="checkout-grid">
          {/* Left Column: Form */}
          <div className="checkout-form-side">
            <div className="checkout-card mb-6">
              <h2 className="card-title">🚚 Metode Pengambilan</h2>
              <div className="shipping-options-grid">
                <label className={`shipping-option ${shippingMethod === 'pickup' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="pickup"
                    checked={shippingMethod === 'pickup'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <span className="option-emoji">🏪</span>
                    <div className="option-info">
                      <div className="option-name">Ambil Sendiri</div>
                      <div className="option-desc">Ambil langsung di toko mitra</div>
                    </div>
                  </div>
                </label>

                <label className={`shipping-option ${shippingMethod === 'delivery' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="delivery"
                    checked={shippingMethod === 'delivery'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <span className="option-emoji">🛵</span>
                    <div className="option-info">
                      <div className="option-name">Kirim Ke Alamat</div>
                      <div className="option-desc">Dikirim kurir ke pintu rumahmu</div>
                    </div>
                  </div>
                </label>
              </div>

              {shippingMethod === 'delivery' && (
                <div className="delivery-services mt-6">
                  <h3 className="text-sm font-bold mb-3">Pilih Layanan Pengiriman:</h3>
                  <div className="services-grid">
                    {['gojek', 'grab', 'paxel'].map((service) => (
                      <label key={service} className={`service-chip ${shippingService === service ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="shippingService"
                          value={service}
                          checked={shippingService === service}
                          onChange={(e) => setShippingService(e.target.value)}
                        />
                        <span className="capitalize">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {shippingMethod === 'delivery' && (
              <div className="checkout-card">
                <h2 className="card-title">📍 Alamat Pengiriman</h2>
                <div className="checkout-form-grid">
                  <div className="checkout-field full">
                    <label>Nama Jalan / No. Rumah</label>
                    <input
                      type="text"
                      className="checkout-input"
                      placeholder="Contoh: Jl. Raya Ubud No. 12"
                      value={jalan}
                      onChange={(e) => setJalan(e.target.value)}
                    />
                  </div>


                <div className="checkout-field">
                  <label>Provinsi</label>
                  <select
                    className="checkout-input"
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="checkout-field">
                  <label>Kota / Kabupaten</label>
                  <select
                    className="checkout-input"
                    value={selectedRegency}
                    onChange={(e) => setSelectedRegency(e.target.value)}
                    disabled={!selectedProvince}
                  >
                    <option value="">Pilih Kota/Kab</option>
                    {regencies.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="checkout-field">
                  <label>Kecamatan</label>
                  <select
                    className="checkout-input"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedRegency}
                  >
                    <option value="">Pilih Kecamatan</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="checkout-field">
                  <label>Kelurahan / Desa</label>
                  <select
                    className="checkout-input"
                    value={selectedVillage}
                    onChange={(e) => setSelectedVillage(e.target.value)}
                    disabled={!selectedDistrict}
                  >
                    <option value="">Pilih Kelurahan</option>
                    {villages.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div className="checkout-field">
                  <label>Kode Pos (Opsional)</label>
                  <input
                    type="text"
                    className="checkout-input"
                    placeholder="Kode Pos"
                    value={kodepos}
                    onChange={(e) => setKodepos(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

            <div className="checkout-card mt-6">
              <h2 className="card-title">📝 Catatan (Opsional)</h2>
              <input
                type="text"
                className="checkout-input"
                placeholder="Contoh: Titip di satpam, jangan diketuk, dll."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="checkout-card mt-6">
              <h2 className="card-title">💳 Metode Pembayaran</h2>
              <div className="payment-options">
                <div className="payment-option active">
                  <div className="payment-radio">✓</div>
                  <div className="payment-info">
                    <span className="payment-name">Bayar di Tempat (COD)</span>
                    <span className="payment-desc">Bayar tunai saat barang sampai</span>
                  </div>
                </div>
                <div className="payment-option disabled">
                  <div className="payment-radio-off"></div>
                  <div className="payment-info">
                    <span className="payment-name">Transfer Bank / QRIS</span>
                    <span className="payment-desc">Segera hadir (Coming Soon)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="checkout-summary-side">
            <div className="checkout-card sticky-top">
              <h2 className="card-title">Ringkasan Belanja</h2>
              
              <div className="checkout-items-list mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout-item">
                    <span className="item-emoji">{item.emoji}</span>
                    <div className="item-details">
                      <span className="item-name">{item.nama_produk}</span>
                      <span className="item-meta">{item.quantity}x @ {formatRupiah(item.harga)}</span>
                    </div>
                    <span className="item-subtotal">{formatRupiah(item.harga * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="checkout-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>{formatRupiah(cartTotal)}</span>
                </div>
                <div className="total-row">
                  <span>Biaya Pengiriman</span>
                  <span className="text-free">GRATIS</span>
                </div>
                <div className="total-row grand-total mt-4">
                  <span>Total Pembayaran</span>
                  <span>{formatRupiah(cartTotal)}</span>
                </div>
              </div>

              <button 
                className="btn-primary w-full mt-8 py-4 text-lg font-bold"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
              >
                {isSubmitting ? "Memproses..." : "Buat Pesanan Sekarang"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
