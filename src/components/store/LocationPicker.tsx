"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface Titik {
  lat: number;
  lng: number;
}

// Tengah Jabodetabek — titik awal peta sebelum pembeli memilih lokasi.
const PUSAT: Titik = { lat: -6.25, lng: 106.85 };

const ikonPin = L.divIcon({
  className: "custom-map-marker",
  html: '<div class="map-marker map-marker-selected">📍</div>',
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

/** Peta kecil untuk menandai titik antar. Klik peta atau geser pin. */
export function LocationPicker({
  value,
  onChange,
}: {
  value: Titik | null;
  onChange: (titik: Titik) => void;
}) {
  const wadahRef = useRef<HTMLDivElement>(null);
  const petaRef = useRef<L.Map | null>(null);
  const pinRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  const [mencari, setMencari] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!wadahRef.current || petaRef.current) return;
    const peta = L.map(wadahRef.current, { center: [PUSAT.lat, PUSAT.lng], zoom: 11 });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(peta);
    peta.on("click", (e: L.LeafletMouseEvent) => {
      onChangeRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
    petaRef.current = peta;
    return () => {
      peta.remove();
      petaRef.current = null;
      pinRef.current = null;
    };
  }, []);

  // Pin mengikuti `value` — baik dari klik peta, geser pin, maupun GPS.
  useEffect(() => {
    const peta = petaRef.current;
    if (!peta || !value) return;
    if (!pinRef.current) {
      pinRef.current = L.marker([value.lat, value.lng], { icon: ikonPin, draggable: true }).addTo(peta);
      pinRef.current.on("dragend", () => {
        const p = pinRef.current!.getLatLng();
        onChangeRef.current({ lat: p.lat, lng: p.lng });
      });
    } else {
      pinRef.current.setLatLng([value.lat, value.lng]);
    }
  }, [value]);

  const pakaiLokasiSaya = () => {
    if (!navigator.geolocation) {
      setPesan("Browser ini tidak mendukung deteksi lokasi. Tandai titik secara manual di peta.");
      return;
    }
    setMencari(true);
    setPesan(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const titik = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onChangeRef.current(titik);
        petaRef.current?.setView([titik.lat, titik.lng], 17);
        setMencari(false);
      },
      () => {
        setPesan("Lokasi tidak bisa dideteksi. Izinkan akses lokasi, atau tandai titik secara manual di peta.");
        setMencari(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="location-picker">
      <div className="location-picker-bar">
        <span>
          {value
            ? "✅ Titik antar sudah ditandai — geser pin kalau kurang tepat."
            : "Klik peta untuk menandai titik antar."}
        </span>
        <button type="button" className="location-picker-gps" onClick={pakaiLokasiSaya} disabled={mencari}>
          {mencari ? "Mendeteksi..." : "📍 Pakai lokasi saya"}
        </button>
      </div>
      <div ref={wadahRef} className="location-picker-map" />
      {pesan && <p className="location-picker-msg">{pesan}</p>}
    </div>
  );
}
