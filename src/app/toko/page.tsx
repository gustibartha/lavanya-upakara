"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

// Dynamic import to avoid SSR issues
const GoogleStoreMap = dynamic(
  () =>
    import("@/components/store/GoogleStoreMap").then(
      (mod) => mod.GoogleStoreMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="store-map-loading">
        <div className="store-map-loading-inner">
          <span>🗺️</span>
          <p>Memuat peta...</p>
        </div>
      </div>
    ),
  }
);

interface StoreData {
  id: string;
  nama_toko: string;
  alamat: string;
  latitude: number;
  longitude: number;
  kategori: string[];
  emoji: string;
  jarak?: string;
  telepon?: string;
  jam_buka?: string;
  jam_tutup?: string;
}

export default function TokoPage() {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "requesting" | "granted" | "denied"
  >("idle");

  // Request user geolocation
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    setLocationStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationStatus("granted");
      },
      () => {
        setLocationStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Fetch stores from API (with proximity if location available)
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        let url = "/api/stores";
        if (userLocation) {
          url += `?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=50`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setStores(data.stores || []);
      } catch (err) {
        console.error("Failed to fetch stores:", err);
      } finally {
        setLoading(false);
      }
    };

    // Wait for location or timeout
    if (locationStatus === "granted" || locationStatus === "denied") {
      fetchStores();
    }
  }, [userLocation, locationStatus]);

  return (
    <>
      <Navbar />
      <main className="toko-page">
        <div className="toko-header">
          <h1 className="toko-title">Toko Terdekat</h1>
          <p className="toko-subtitle">
            {locationStatus === "granted"
              ? `Ditemukan ${stores.length} toko di sekitarmu`
              : "Temukan penjual perlengkapan sembahyang yang ada di sekitarmu"}
          </p>
          {locationStatus === "denied" && (
            <button
              className="btn btn-outline"
              style={{ marginTop: "0.75rem" }}
              onClick={requestLocation}
            >
              📍 Izinkan Akses Lokasi
            </button>
          )}
        </div>

        <div className="toko-content">
          {/* Store List */}
          <div className="toko-list">
            {loading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>
                <p>⏳ Memuat toko...</p>
              </div>
            ) : stores.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>
                <p>😔 Tidak ada toko ditemukan</p>
              </div>
            ) : (
              stores.map((store) => (
                <div
                  key={store.id}
                  className={`toko-card ${selectedStore === store.id ? "toko-card-active" : ""}`}
                  onClick={() => setSelectedStore(store.id)}
                >
                  <div className="toko-card-header">
                    <div className="toko-card-icon">{store.emoji}</div>
                    <div className="toko-card-info">
                      <h3 className="toko-card-name">{store.nama_toko}</h3>
                      <p className="toko-card-address">{store.alamat}</p>
                    </div>
                    {store.jarak && (
                      <div className="toko-card-dist">{store.jarak}</div>
                    )}
                  </div>
                  <div className="toko-card-cats">
                    {store.kategori.map((kat) => (
                      <span key={kat} className="toko-card-cat-pill">
                        {kat}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link
                      href={`/katalog?store=${store.id}`}
                      className="toko-card-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Lihat Produk →
                    </Link>
                    {store.telepon && (
                      <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                        📞 {store.telepon}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Map */}
          <div className="toko-map-wrap">
            <GoogleStoreMap
              stores={stores}
              selectedStore={selectedStore}
              onSelectStore={setSelectedStore}
              userLocation={userLocation}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
