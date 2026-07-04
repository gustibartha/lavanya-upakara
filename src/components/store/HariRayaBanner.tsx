"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUpcomingHariRaya, getDaysUntil, formatTanggalIndo } from "@/lib/hari-raya";
import { products } from "@/lib/data";
import { Bell, BellRing, X, ChevronRight, Package, Clock } from "lucide-react";

export function HariRayaBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [hariRaya, setHariRaya] = useState<ReturnType<typeof getUpcomingHariRaya>>(null);
  const [daysLeft, setDaysLeft] = useState(0);
  const [notifStatus, setNotifStatus] = useState<"idle" | "granted" | "denied" | "loading">("idle");
  const [showBanten, setShowBanten] = useState(false);

  useEffect(() => {
    const upcoming = getUpcomingHariRaya(14);
    if (!upcoming) return;

    // Cek apakah sudah di-dismiss untuk hari raya ini
    const dismissedKey = `hari-raya-dismissed-${upcoming.id}`;
    if (localStorage.getItem(dismissedKey)) return;

    setHariRaya(upcoming);
    setDaysLeft(getDaysUntil(upcoming.tanggal));

    // Cek status notifikasi yang sudah ada
    if (typeof Notification !== "undefined") {
      if (Notification.permission === "granted") setNotifStatus("granted");
      else if (Notification.permission === "denied") setNotifStatus("denied");
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // Schedule a notification for 7 days and 1 day before
  const scheduleLocalNotification = (upcoming: NonNullable<ReturnType<typeof getUpcomingHariRaya>>) => {
    const days = getDaysUntil(upcoming.tanggal);
    // Show immediate notification as a test
    if (Notification.permission === "granted") {
      const urgency = days <= 1 ? "BESOK" : days <= 3 ? `${days} hari lagi` : `${days} hari lagi`;
      new Notification(`🙏 ${upcoming.nama} — ${urgency}!`, {
        body: `Siapkan: ${upcoming.banten_wajib.slice(0, 3).join(", ")} dan lainnya. Pesan sekarang di Lavanya Upakara!`,
        icon: "/icons/icon-192.png",
        tag: "hari-raya-reminder",
      });
    }
  };

  const handleEnableNotification = async () => {
    if (!hariRaya) return;
    setNotifStatus("loading");
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotifStatus("granted");
        scheduleLocalNotification(hariRaya);
      } else {
        setNotifStatus("denied");
      }
    } catch {
      setNotifStatus("denied");
    }
  };

  const handleDismiss = () => {
    if (!hariRaya) return;
    localStorage.setItem(`hari-raya-dismissed-${hariRaya.id}`, "1");
    setDismissed(true);
  };

  if (!hariRaya || dismissed) return null;

  const rekomendasi = hariRaya.produk_rekomendasi
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 4) as typeof products;

  const urgencyColor = daysLeft <= 3 ? "#B84A2A" : daysLeft <= 7 ? "#C8690A" : "#285C42";
  const urgencyLabel = daysLeft === 0 ? "Hari ini!" : daysLeft === 1 ? "Besok!" : `${daysLeft} hari lagi`;

  return (
    <div className="haririraya-banner-wrap" style={{ borderLeftColor: urgencyColor }}>
      {/* Top bar */}
      <div className="haririraya-topbar" style={{ background: urgencyColor }}>
        <div className="haririraya-topbar-inner">
          <div className="haririraya-topbar-left">
            <span className="haririraya-emoji">{hariRaya.emoji}</span>
            <div>
              <span className="haririraya-label">Pengingat Hari Raya</span>
              <h2 className="haririraya-nama">{hariRaya.nama}</h2>
            </div>
          </div>
          <div className="haririraya-topbar-right">
            <div className="haririraya-countdown">
              <Clock size={14} />
              <span>{urgencyLabel}</span>
            </div>
            <div className="haririraya-date">
              {formatTanggalIndo(hariRaya.tanggal)}
            </div>
          </div>
        </div>

        {/* Notif + Dismiss */}
        <div className="haririraya-actions-wrap">
          {notifStatus === "idle" && (
            <button className="haririraya-notif-btn" onClick={handleEnableNotification}>
              <Bell size={16} />
              <span>Aktifkan Pengingat Push</span>
            </button>
          )}
          {notifStatus === "loading" && (
            <span className="haririraya-notif-status">Meminta izin...</span>
          )}
          {notifStatus === "granted" && (
            <span className="haririraya-notif-status granted">
              <BellRing size={14} /> Pengingat aktif ✓
            </span>
          )}
          {notifStatus === "denied" && (
            <span className="haririraya-notif-status denied">Notifikasi diblokir browser</span>
          )}
          <button className="haririraya-dismiss" onClick={handleDismiss} aria-label="Tutup">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="haririraya-content">
        {/* Makna */}
        <p className="haririraya-makna">{hariRaya.makna}</p>

        {/* Banten Wajib */}
        <div className="haririraya-banten-section">
          <button
            className="haririraya-banten-toggle"
            onClick={() => setShowBanten(!showBanten)}
          >
            <Package size={16} />
            <span>Banten yang perlu disiapkan ({hariRaya.banten_wajib.length})</span>
            <ChevronRight
              size={16}
              style={{
                transform: showBanten ? "rotate(90deg)" : "rotate(0)",
                transition: "transform 0.2s",
              }}
            />
          </button>
          {showBanten && (
            <div className="haririraya-banten-list">
              {hariRaya.banten_wajib.map((banten, i) => (
                <div key={i} className="haririraya-banten-chip">
                  <span className="haririraya-banten-dot" style={{ background: urgencyColor }} />
                  {banten}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Produk Rekomendasi */}
        {rekomendasi.length > 0 && (
          <div className="haririraya-rekomendasi">
            <h3 className="haririraya-rekomendasi-title">
              🛍️ Paket Rekomendasi untuk {hariRaya.nama}
            </h3>
            <div className="haririraya-products-grid">
              {rekomendasi.map((prod) => (
                <Link
                  href={`/katalog/${prod.slug}`}
                  key={prod.id}
                  className="haririraya-product-card"
                >
                  <div
                    className="haririraya-product-img"
                    style={{ background: prod.bg_color }}
                  >
                    <span style={{ fontSize: "2rem" }}>{prod.emoji}</span>
                  </div>
                  <div className="haririraya-product-info">
                    <span className="haririraya-product-name">{prod.nama_produk}</span>
                    <span className="haririraya-product-price">
                      Rp {prod.harga.toLocaleString("id-ID")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/katalog" className="haririraya-see-all">
              Lihat semua produk <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
