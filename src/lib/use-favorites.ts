"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "lavanya_favorit";

// Snapshot di-cache berdasarkan teks mentahnya. Tanpa ini, getSnapshot
// mengembalikan array baru tiap render dan React akan melooping tanpa henti.
let cachedRaw: string | null = null;
let cachedValue: string[] = [];

const EMPTY: string[] = [];
const listeners = new Set<() => void>();

function readRaw() {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    // Penyimpanan bisa diblokir browser (mode privat, setelan situs).
    return "[]";
  }
}

function getSnapshot(): string[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = JSON.parse(raw);
      cachedValue = Array.isArray(parsed) ? parsed : [];
    } catch {
      cachedValue = [];
    }
  }
  return cachedValue;
}

/** Di server tidak ada localStorage, jadi selalu kosong. */
function getServerSnapshot(): string[] {
  return EMPTY;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Menjaga tab lain ikut sinkron.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Daftar produk favorit, disimpan di perangkat pembeli.
 *
 * Memakai useSyncExternalStore, bukan useEffect + setState, supaya hasil
 * render di server dan browser konsisten tanpa render berlapis.
 */
export function useFavorites() {
  const favorites = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggleFavorite = useCallback(
    (slug: string) => {
      const next = favorites.includes(slug)
        ? favorites.filter((s) => s !== slug)
        : [...favorites, slug];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // Kalau gagal disimpan, biarkan — tombolnya tetap tidak error.
      }
      listeners.forEach((l) => l());
    },
    [favorites],
  );

  return { favorites, toggleFavorite };
}
