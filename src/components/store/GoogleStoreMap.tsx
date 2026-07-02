"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import type L from "leaflet";

interface StoreData {
  id: string;
  nama_toko: string;
  alamat: string;
  latitude: number;
  longitude: number;
  kategori: string[];
  emoji: string;
  jarak?: string;
}

interface GoogleStoreMapProps {
  stores: StoreData[];
  selectedStore: string | null;
  onSelectStore: (storeId: string) => void;
  userLocation: { lat: number; lng: number } | null;
}

export function GoogleStoreMap({
  stores,
  selectedStore,
  onSelectStore,
  userLocation,
}: GoogleStoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
      setApiError("NO_API_KEY");
      return;
    }

    setOptions({
      key: apiKey,
      v: "weekly",
      libraries: ["places", "marker"],
    });

    importLibrary("maps")
      .then(async () => {
        if (!mapRef.current) return;

        const center = userLocation
          ? { lat: userLocation.lat, lng: userLocation.lng }
          : { lat: -8.65, lng: 115.22 }; // Default: Denpasar

        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 12,
          mapId: "lavanya-upakara-map",
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        mapInstanceRef.current = map;

        // Create single info window
        infoWindowRef.current = new google.maps.InfoWindow();

        // Add user location marker
        if (userLocation) {
          const userMarkerEl = document.createElement("div");
          userMarkerEl.innerHTML = `
            <div style="
              width: 20px; height: 20px;
              background: #4285F4; border: 3px solid white;
              border-radius: 50%; box-shadow: 0 2px 8px rgba(66,133,244,0.5);
            "></div>
          `;

          new google.maps.marker.AdvancedMarkerElement({
            map,
            position: userLocation,
            content: userMarkerEl,
            title: "Lokasi Anda",
          });
        }

        // Add store markers
        for (const store of stores) {
          const markerEl = document.createElement("div");
          markerEl.className = "gmap-marker";
          markerEl.innerHTML = `
            <div class="gmap-marker-pin">
              <span>${store.emoji}</span>
            </div>
          `;

          const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat: store.latitude, lng: store.longitude },
            content: markerEl,
            title: store.nama_toko,
          });

          marker.addListener("click", () => {
            onSelectStore(store.id);
            showInfoWindow(store, marker);
          });

          markersRef.current.set(store.id, marker);
        }

        setMapLoaded(true);
      })
      .catch((err) => {
        console.error("Google Maps load error:", err);
        setApiError("LOAD_ERROR");
      });

    return () => {
      markersRef.current.clear();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation]);

  const showInfoWindow = useCallback(
    (store: StoreData, marker: google.maps.marker.AdvancedMarkerElement) => {
      if (!infoWindowRef.current || !mapInstanceRef.current) return;

      infoWindowRef.current.setContent(`
        <div style="font-family: var(--font-body, sans-serif); padding: 4px 0; min-width: 200px;">
          <div style="font-size: 1rem; font-weight: 700; color: #180E04; margin-bottom: 4px;">
            ${store.emoji} ${store.nama_toko}
          </div>
          <div style="font-size: 0.8rem; color: #A08060; margin-bottom: 6px;">
            ${store.alamat}
          </div>
          ${store.jarak ? `<div style="font-size: 0.75rem; color: #285C42; font-weight: 600;">📍 ${store.jarak}</div>` : ""}
          <div style="margin-top: 6px; display: flex; gap: 4px; flex-wrap: wrap;">
            ${store.kategori.map((k) => `<span style="font-size: 0.65rem; background: #EFE5CC; padding: 2px 8px; border-radius: 100px; color: #7A4A28;">${k}</span>`).join("")}
          </div>
        </div>
      `);
      infoWindowRef.current.open(mapInstanceRef.current, marker);
    },
    []
  );

  // Handle selected store change
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    // Update marker styles
    markersRef.current.forEach((marker, storeId) => {
      const markerEl = marker.content as HTMLElement;
      const pin = markerEl.querySelector(".gmap-marker-pin") as HTMLElement;
      if (pin) {
        if (storeId === selectedStore) {
          pin.classList.add("gmap-marker-selected");
        } else {
          pin.classList.remove("gmap-marker-selected");
        }
      }
    });

    // Pan to selected store
    if (selectedStore) {
      const store = stores.find((s) => s.id === selectedStore);
      const marker = markersRef.current.get(selectedStore);
      if (store && marker) {
        mapInstanceRef.current.panTo({
          lat: store.latitude,
          lng: store.longitude,
        });
        mapInstanceRef.current.setZoom(14);
        showInfoWindow(store, marker);
      }
    }
  }, [selectedStore, mapLoaded, stores, showInfoWindow]);

  // Fallback: No API key — show Leaflet/OpenStreetMap
  if (apiError === "NO_API_KEY") {
    return <FallbackLeafletMap stores={stores} selectedStore={selectedStore} onSelectStore={onSelectStore} />;
  }

  if (apiError === "LOAD_ERROR") {
    return (
      <div className="store-map-loading">
        <div className="store-map-loading-inner">
          <span>⚠️</span>
          <p>Gagal memuat Google Maps. Periksa API key Anda.</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="store-map" />;
}

// ==========================================
// Fallback: Leaflet/OpenStreetMap (no API key needed)
// ==========================================
function FallbackLeafletMap({
  stores,
  selectedStore,
  onSelectStore,
}: {
  stores: StoreData[];
  selectedStore: string | null;
  onSelectStore: (storeId: string) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [mapReady, setMapReady] = useState(false);

  // Dynamically import Leaflet only when needed
  useEffect(() => {

    import("leaflet").then((L) => {
      // Import CSS
      import("leaflet/dist/leaflet.css");

      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        center: [-8.65, 115.22],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const createIcon = (emoji: string, isSelected: boolean) => {
        return L.divIcon({
          className: "custom-map-marker",
          html: `<div class="map-marker ${isSelected ? "map-marker-selected" : ""}">${emoji}</div>`,
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -48],
        });
      };

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

        marker.on("click", () => onSelectStore(store.id));
        markersRef.current.set(store.id, marker);
      });

      mapInstanceRef.current = map;
      setMapReady(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current.clear();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const createIcon = (emoji: string, isSelected: boolean) => {
        return L.divIcon({
          className: "custom-map-marker",
          html: `<div class="map-marker ${isSelected ? "map-marker-selected" : ""}">${emoji}</div>`,
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -48],
        });
      };

      stores.forEach((store) => {
        const marker = markersRef.current.get(store.id);
        if (marker) {
          const isSelected = store.id === selectedStore;
          marker.setIcon(createIcon(store.emoji, isSelected));
          if (isSelected) {
            mapInstanceRef.current?.setView([store.latitude, store.longitude], 14, { animate: true });
            marker.openPopup();
          }
        }
      });
    });
  }, [selectedStore, mapReady, stores]);

  return <div ref={mapRef} className="store-map" />;
}


