"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Kolom pencarian di hero. Sebelumnya tombol "Cari" tidak melakukan apa pun.
 * Sekarang kata kuncinya diteruskan ke katalog lewat query `q`.
 */
export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/katalog?q=${encodeURIComponent(q)}` : "/katalog");
  };

  return (
    <form className="hero-search anim-fadeup stagger-2" onSubmit={submit} role="search">
      <span className="hero-search-icon" aria-hidden="true">🔍</span>
      <input
        type="search"
        className="hero-search-input"
        placeholder="Cari canang, dupa, buah..."
        aria-label="Cari produk sarana upacara"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="hero-search-btn">
        Cari
      </button>
    </form>
  );
}
