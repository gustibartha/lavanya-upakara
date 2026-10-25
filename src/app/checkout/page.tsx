"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { authClient } from "@/lib/auth-client";
import { formatRupiah } from "@/lib/data";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import dynamic from "next/dynamic";
import type { Titik } from "@/components/store/LocationPicker";
import { ONGKIR_MINIMUM, TARIF_PER_KM } from "@/lib/ongkir";

// Leaflet menyentuh `window` saat dimuat, jadi hanya di-render di browser.
const LocationPicker = dynamic(
  () => import("@/components/store/LocationPicker").then((m) => m.LocationPicker),
  { ssr: false, loading: () => <div className="location-picker-map location-picker-loading">Memuat peta…</div> },
);

const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
const MIDTRANS_SNAP_URL =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

interface OngkirToko {
  store_id: string;
  nama_toko: string;
  jarak_km: number;
  ongkir: number;
  terjangkau: boolean;
}

interface CreatedOrder {
  id: string;
  store_id: string;
  total_harga: number;
  metode_bayar: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart, removeFromCart, isInitialized } = useCart();
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
  const [titikAntar, setTitikAntar] = useState<Titik | null>(null);
  const [shippingMethod, setShippingMethod] = useState("pickup"); // pickup | delivery
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [createdOrders, setCreatedOrders] = useState<CreatedOrder[]>([]);
  const jumlahToko = new Set(cartItems.map((item) => item.store_id)).size;

  // Opsi pembayaran online hanya ditawarkan kalau Client Key sudah dipasang,
  // supaya tidak ada tombol yang menuntun ke jalan buntu.
  const midtransReady = Boolean(MIDTRANS_CLIENT_KEY);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "midtrans">("cod");
  // Pesanan antar selalu dibayar online (barang + ongkir di depan).
  const metodeBayar = shippingMethod === "delivery" ? "midtrans" : paymentMethod;

  // Perkiraan ongkir per toko dari server untuk titik antar yang dipilih.
  // `kunci` mencegah angka lama tampil saat pin atau isi keranjang berubah.
  const [ongkirInfo, setOngkirInfo] = useState<{ kunci: string; toko: OngkirToko[] } | null>(null);
  const storeIds = [...new Set(cartItems.map((i) => i.store_id))].sort();
  const kunciOngkir = titikAntar ? `${titikAntar.lat},${titikAntar.lng}|${storeIds.join(",")}` : "";
  useEffect(() => {
    if (shippingMethod !== "delivery" || !kunciOngkir) return;
    const [titik, ids] = kunciOngkir.split("|");
    const [lat, lng] = titik.split(",").map(Number);
    let batal = false;
    fetch("/api/ongkir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng, store_ids: ids.split(",") }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!batal && Array.isArray(data.toko)) setOngkirInfo({ kunci: kunciOngkir, toko: data.toko });
      })
      .catch(() => {});
    return () => {
      batal = true;
    };
  }, [shippingMethod, kunciOngkir]);
  const ongkirSiap = Boolean(ongkirInfo && ongkirInfo.kunci === kunciOngkir);
  const totalOngkir = ongkirSiap ? ongkirInfo!.toko.reduce((s, t) => s + t.ongkir, 0) : 0;
  const adaTokoTerlaluJauh = ongkirSiap && ongkirInfo!.toko.some((t) => !t.terjangkau);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

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

  /**
   * Membuka Snap untuk pesanan yang baru dibuat.
   *
   * Hasil dari callback Snap hanya dipakai untuk memilih kalimat yang
   * ditampilkan. Pelunasan pesanan tetap ditentukan webhook Midtrans di
   * server, karena callback di browser bisa dipalsukan.
   */
  const startMidtransPayment = async (order: { id: string }) => {
    try {
      const res = await fetch("/api/payments/midtrans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: order.id }),
      });
      const data = await res.json();

      if (!res.ok || !data.token) {
        setOrderSuccess(order);
        setPaymentNotice(
          (data.error || "Gagal membuka halaman pembayaran") +
            ". Pesanan Anda tersimpan dan bisa dibayar lewat menu Riwayat.",
        );
        return;
      }

      if (!window.snap) {
        // snap.js gagal dimuat — jangan biarkan pembeli buntu.
        window.location.href = data.redirect_url;
        return;
      }

      window.snap.pay(data.token, {
        onSuccess: () => {
          setOrderSuccess(order);
          setPaymentNotice(
            "Pembayaran diterima. Status pesanan diperbarui setelah dikonfirmasi Midtrans.",
          );
        },
        onPending: () => {
          setOrderSuccess(order);
          setPaymentNotice(
            "Pembayaran menunggu penyelesaian. Selesaikan sesuai instruksi, status akan otomatis diperbarui.",
          );
        },
        onError: () => {
          setOrderSuccess(order);
          setPaymentNotice(
            "Pembayaran gagal. Pesanan tetap tersimpan dan bisa dibayar ulang lewat menu Riwayat.",
          );
        },
        onClose: () => {
          setOrderSuccess(order);
          setPaymentNotice(
            "Anda menutup halaman pembayaran sebelum selesai. Pesanan tersimpan dan bisa dibayar lewat menu Riwayat.",
          );
        },
      });
    } catch (error) {
      console.error("Midtrans error:", error);
      setOrderSuccess(order);
      setPaymentNotice(
        "Koneksi ke pembayaran gagal. Pesanan tersimpan dan bisa dibayar lewat menu Riwayat.",
      );
    }
  };

  const handlePlaceOrder = async () => {
    if (!session) {
      router.push("/masuk?callbackUrl=/checkout");
      return;
    }

    if (shippingMethod === "delivery" && (!jalan.trim() || !selectedProvince || !selectedRegency || !selectedDistrict || !selectedVillage)) {
      alert("Silakan lengkapi alamat pengiriman");
      return;
    }
    if (shippingMethod === "delivery" && !titikAntar) {
      alert("Tandai titik antar di peta supaya kurir bisa menemukan alamat Anda.");
      return;
    }
    if (shippingMethod === "delivery" && !ongkirSiap) {
      alert("Ongkir masih dihitung, tunggu sebentar lalu coba lagi.");
      return;
    }
    if (shippingMethod === "delivery" && adaTokoTerlaluJauh) {
      alert('Alamat terlalu jauh dari salah satu toko untuk diantar. Pilih "Ambil Sendiri".');
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

      const payload = {
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
        shipping_service: null,
        lokasi_lat: shippingMethod === "delivery" ? titikAntar?.lat : undefined,
        lokasi_lng: shippingMethod === "delivery" ? titikAntar?.lng : undefined,
        catatan: note,
        metode_bayar: metodeBayar
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.produk_tidak_tersedia)) {
          const habis = cartItems.filter((i) => data.produk_tidak_tersedia.includes(i.id));
          habis.forEach((i) => removeFromCart(i.id));
          alert(
            `Produk berikut sudah tidak tersedia dan dihapus dari keranjang: ${habis
              .map((i) => i.nama_produk)
              .join(", ")}. Periksa kembali keranjang Anda lalu pesan ulang.`,
          );
          return;
        }
        alert("Gagal: " + (data.error || "Terjadi kesalahan pada server"));
        return;
      }

      // Pesanan sudah tersimpan. Keranjang boleh dikosongkan sekarang —
      // kalau pembayaran batal, pesanannya tetap bisa dibayar dari Riwayat.
      clearCart();

      const dibuat: CreatedOrder[] = data.orders;
      setCreatedOrders(dibuat);

      // Keranjang multi-toko menghasilkan beberapa pesanan; masing-masing
      // dibayar dari halaman Riwayat, bukan dibuka Snap berturut-turut.
      if (metodeBayar === "midtrans" && dibuat.length === 1) {
        await startMidtransPayment(dibuat[0]);
        return;
      }

      if (metodeBayar === "midtrans") {
        setPaymentNotice(
          `Pesanan Anda dipecah menjadi ${dibuat.length} pesanan karena berasal dari ${dibuat.length} toko berbeda. Bayar masing-masing lewat tombol di bawah.`,
        );
      }
      setOrderSuccess(dibuat[0]);
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
          {createdOrders.length > 1 ? (
            <> Pesanan Anda dikirim ke <strong>{createdOrders.length} toko</strong> berbeda.</>
          ) : (
            <> Nomor pesanan Anda: <strong>{orderSuccess.id}</strong></>
          )}
        </p>
        {paymentNotice && <p className="payment-notice">{paymentNotice}</p>}
        {createdOrders.length > 1 && (
          <ul className="success-order-list">
            {createdOrders.map((o) => (
              <li key={o.id}>
                <span>
                  <strong>{o.id}</strong> · {formatRupiah(o.total_harga)}
                </span>
                <Link href={`/riwayat/${o.id}`} className="btn-ghost">
                  {o.metode_bayar === "midtrans" ? "Bayar →" : "Lihat →"}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="success-actions">
          <Link
            href={createdOrders.length > 1 ? "/riwayat" : `/riwayat/${orderSuccess.id}`}
            className="btn-primary"
          >
            {createdOrders.length > 1 ? "Lihat Semua Pesanan" : "Lihat Pesanan"}
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
      {midtransReady && (
        <Script
          src={MIDTRANS_SNAP_URL}
          data-client-key={MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      )}
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
                      <div className="option-desc">Ambil di toko — bisa bayar di tempat</div>
                    </div>
                  </div>
                </label>

                <label
                  className={`shipping-option ${shippingMethod === 'delivery' ? 'active' : ''} ${!midtransReady ? 'disabled' : ''}`}
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="delivery"
                    checked={shippingMethod === 'delivery'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    disabled={!midtransReady}
                  />
                  <div className="option-content">
                    <span className="option-emoji">🛵</span>
                    <div className="option-info">
                      <div className="option-name">Kirim Ke Alamat</div>
                      <div className="option-desc">
                        {midtransReady
                          ? "Diantar kurir, ongkir dihitung otomatis"
                          : "Belum tersedia — butuh pembayaran online"}
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {shippingMethod === 'delivery' && (
                <p className="checkout-ongkir-note">
                  🛵 Diantar kurir instan (GoSend/GrabExpress) yang kami pesankan.
                  Ongkir dihitung otomatis dari jarak toko ke titik antar
                  (Rp {TARIF_PER_KM.toLocaleString("id-ID")}/km, minimal Rp{" "}
                  {ONGKIR_MINIMUM.toLocaleString("id-ID")}) dan dibayar online bersama
                  pesanan.
                </p>
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
                      placeholder="Contoh: Jl. Daksinapati Raya No. 12, Rawamangun"
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

                <div className="checkout-field full">
                  <label>Titik Antar di Peta</label>
                  <LocationPicker value={titikAntar} onChange={setTitikAntar} />
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
                {shippingMethod === "delivery" ? (
                  <div className="payment-option disabled">
                    <div className="payment-radio-off"></div>
                    <div className="payment-info">
                      <span className="payment-name">Bayar di Tempat (COD)</span>
                      <span className="payment-desc">
                        Hanya untuk ambil di toko — kurir tidak menerima pembayaran tunai
                      </span>
                    </div>
                  </div>
                ) : (
                  <label className={`payment-option ${metodeBayar === "cod" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={metodeBayar === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <div className="payment-radio">{metodeBayar === "cod" ? "✓" : ""}</div>
                    <div className="payment-info">
                      <span className="payment-name">Bayar di Tempat (COD)</span>
                      <span className="payment-desc">Bayar tunai saat mengambil di toko</span>
                    </div>
                  </label>
                )}

                {midtransReady ? (
                  <label
                    className={`payment-option ${metodeBayar === "midtrans" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="midtrans"
                      checked={metodeBayar === "midtrans"}
                      onChange={() => setPaymentMethod("midtrans")}
                    />
                    <div className="payment-radio">
                      {metodeBayar === "midtrans" ? "✓" : ""}
                    </div>
                    <div className="payment-info">
                      <span className="payment-name">
                        QRIS, Transfer Bank &amp; E-Wallet
                      </span>
                      <span className="payment-desc">
                        Bayar online lewat Midtrans — QRIS, VA, GoPay, ShopeePay
                      </span>
                    </div>
                  </label>
                ) : (
                  <div className="payment-option disabled">
                    <div className="payment-radio-off"></div>
                    <div className="payment-info">
                      <span className="payment-name">QRIS, Transfer Bank &amp; E-Wallet</span>
                      <span className="payment-desc">Belum aktif di server ini</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="checkout-summary-side">
            <div className="checkout-card sticky-top">
              <h2 className="card-title">Ringkasan Belanja</h2>

              {jumlahToko > 1 && (
                <p className="checkout-multistore-note">
                  🏪 Keranjang berisi produk dari {jumlahToko} toko. Pesanan akan
                  dipecah menjadi {jumlahToko} pesanan — tiap toko memproses dan
                  mengirim pesanannya sendiri.
                </p>
              )}

              <div className="checkout-items-list mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout-item">
                    <span className="item-emoji">{item.emoji}</span>
                    <div className="item-details">
                      <span className="item-name">{item.nama_produk}</span>
                      {jumlahToko > 1 && <span className="item-meta">{item.nama_toko}</span>}
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
                  <span>Ongkos Kirim</span>
                  {shippingMethod === "pickup" ? (
                    <span className="text-free">Ambil di toko</span>
                  ) : !titikAntar ? (
                    <span className="text-muted">Tandai titik antar</span>
                  ) : !ongkirSiap ? (
                    <span className="text-muted">Menghitung…</span>
                  ) : (
                    <span>{formatRupiah(totalOngkir)}</span>
                  )}
                </div>
                {shippingMethod === "delivery" && ongkirSiap && ongkirInfo!.toko.length > 0 && (
                  <div className="checkout-ongkir-detail">
                    {ongkirInfo!.toko.map((t) => (
                      <div key={t.store_id} className={t.terjangkau ? "" : "checkout-ongkir-jauh"}>
                        {t.nama_toko} · ±{t.jarak_km} km
                        {t.terjangkau ? ` · ${formatRupiah(t.ongkir)}` : " · terlalu jauh untuk diantar"}
                      </div>
                    ))}
                  </div>
                )}
                <div className="total-row grand-total mt-4">
                  <span>Total Pembayaran</span>
                  <span>{formatRupiah(cartTotal + (shippingMethod === "delivery" ? totalOngkir : 0))}</span>
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
