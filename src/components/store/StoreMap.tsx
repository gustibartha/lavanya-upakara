"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { stores, type Store } from "@/lib/data";

interface StoreMapProps {
  selectedStore: string | null;
  onSelectStore: (storeId: string) => void;
}

export function StoreMap({ selectedStore, onSelectStore }: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Denpasar, Bali
    const map = L.map(mapRef.current, {
      center: [-8.65, 115.22],
      zoom: 12,
      zoomControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Create custom icon
    const createIcon = (emoji: string, isSelected: boolean) => {
      return L.divIcon({
        className: "custom-map-marker",
        html: `<div class="map-marker ${isSelected ? "map-marker-selected" : ""}">${emoji}</div>`,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48],
      });
    };

    // Add markers for each store
    stores.forEach((store) => {
      const marker = L.marker([store.latitude, store.longitude], {
        icon: createIcon(store.emoji, false),
      }).addTo(map);

      marker.bindPopup(
        `<div class="map-popup">
          <strong>${store.nama_toko}</strong><br/>
          <span>${store.alamat}</span><br/>
          <span class="map-popup-cats">${store.kategori.join(" · ")}</span>
        </div>`,
        { className: "lavanya-popup" }
      );

      marker.on("click", () => {
        onSelectStore(store.id);
      });

      markersRef.current.set(store.id, marker);
    });

    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle selected store changes
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const createIcon = (emoji: string, isSelected: boolean) => {
      return L.divIcon({
        className: "custom-map-marker",
        html: `<div class="map-marker ${isSelected ? "map-marker-selected" : ""}">${emoji}</div>`,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48],
      });
    };

    // Update all markers
    stores.forEach((store) => {
      const marker = markersRef.current.get(store.id);
      if (marker) {
        const isSelected = store.id === selectedStore;
        marker.setIcon(createIcon(store.emoji, isSelected));

        if (isSelected) {
          mapInstanceRef.current?.setView(
            [store.latitude, store.longitude],
            14,
            { animate: true }
          );
          marker.openPopup();
        }
      }
    });
  }, [selectedStore, mapReady]);

  return <div ref={mapRef} className="store-map" />;
}
