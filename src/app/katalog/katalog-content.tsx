"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categories, formatRupiah } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import type { ProdukKatalog } from "@/lib/katalog";

const URUTAN = [
  { value: "", label: "Rekomendasi" },
  { value: "termurah", label: "Harga Terendah" },
  { value: "termahal", label: "Harga Tertinggi" },
  { value: "terbaru", label: "Terbaru" },
] as const;

export default function KatalogContent({ produk }: { produk: ProdukKatalog[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filter tersimpan di URL — tombol Back, refresh, dan tautan yang
  // dibagikan membawa pilihan yang sama.
  const activeKategori = searchParams.get("kategori") || "semua";
  const activeStore = searchParams.get("store") || "";
  const urut = searchParams.get("urut") || "";
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const { addToCart } = useCart();
  const [baruDitambah, setBaruDitambah] = useState<string | null>(null);

  const setParam = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value && value !== "semua") params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const namaTokoAktif = produk.find((p) => p.store_id === activeStore)?.nama_toko;

  const filteredProducts = useMemo(() => {
    let result = produk;

    if (activeKategori !== "semua") {
      result = result.filter((p) => p.kategori_slug === activeKategori);
    }
    if (activeStore) {
      result = result.filter((p) => p.store_id === activeStore);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.nama_produk.toLowerCase().includes(q) ||
          p.kategori.toLowerCase().includes(q) ||
          p.deskripsi.toLowerCase().includes(q) ||
          p.nama_toko.toLowerCase().includes(q),
      );
    }

    if (urut === "termurah") result = [...result].sort((a, b) => a.harga - b.harga);
    else if (urut === "termahal") result = [...result].sort((a, b) => b.harga - a.harga);
    else if (urut === "terbaru")
      result = [...result].sort((a, b) => b.created_at.localeCompare(a.created_at));

    return result;
  }, [produk, activeKategori, activeStore, searchQuery, urut]);

  const tambahKeKeranjang = (p: ProdukKatalog) => {
    addToCart({ ...p, image: p.image ?? undefined }, 1);
    setBaruDitambah(p.id);
    window.setTimeout(() => setBaruDitambah((id) => (id === p.id ? null : id)), 1600);
  };

  const resetFilter = () => {
    setSearchQuery("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="katalog-page">
      <div className="katalog-header">
        <h1 className="katalog-title">Katalog Produk</h1>
        <p className="katalog-subtitle">
          Temukan perlengkapan sembahyang yang kamu butuhkan dari penjual
          terpercaya di sekitarmu.
        </p>
      </div>

      <div className="katalog-search-wrap">
        <div className="katalog-search">
          <span className="katalog-search-icon">🔍</span>
          <input
            type="search"
            placeholder="Cari canang, dulang, dupa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => setParam({ q: searchQuery.trim() })}
            onKeyDown={(e) => {
              if (e.key === "Enter") setParam({ q: searchQuery.trim() });
            }}
            className="katalog-search-input"
            aria-label="Cari produk"
          />
          {searchQuery && (
            <button
              className="katalog-search-clear"
              aria-label="Hapus pencarian"
              onClick={() => {
                setSearchQuery("");
                setParam({ q: "" });
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="katalog-filters">
        <button
          className={`filter-pill ${activeKategori === "semua" ? "active" : ""}`}
          onClick={() => setParam({ kategori: "" })}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-pill ${activeKategori === cat.slug ? "active" : ""}`}
            onClick={() => setParam({ kategori: cat.slug })}
          >
            {cat.emoji} {cat.nama}
          </button>
        ))}
      </div>

      <div className="katalog-results-info katalog-toolbar">
        <span>
          Menampilkan <strong>{filteredProducts.length}</strong> produk
          {activeKategori !== "semua" && (
            <>
              {" "}dalam{" "}
              <strong>{categories.find((c) => c.slug === activeKategori)?.nama}</strong>
            </>
          )}
          {namaTokoAktif && (
            <span className="katalog-store-chip">
              🏪 {namaTokoAktif}
              <button aria-label="Hapus filter toko" onClick={() => setParam({ store: "" })}>
                ✕
              </button>
            </span>
          )}
        </span>
        <label className="katalog-sort">
          Urutkan
          <select value={urut} onChange={(e) => setParam({ urut: e.target.value })}>
            {URUTAN.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="katalog-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="katalog-card">
              <Link href={`/katalog/${product.slug}`}>
                <div className="katalog-card-img" style={{ background: product.bg_color }}>
                  {product.image ? (
                    <img src={product.image} alt={product.nama_produk} className="product-card-img" />
                  ) : (
                    <span className="katalog-card-emoji" aria-hidden="true">
                      {product.emoji}
                    </span>
                  )}
                  {product.populer && <span className="katalog-card-badge">Populer</span>}
                </div>
              </Link>
              <div className="katalog-card-body">
                <Link href={`/katalog/${product.slug}`}>
                  <div className="katalog-card-category" title={product.kategori}>
                    {product.kategori}
                  </div>
                  <h3 className="katalog-card-name">{product.nama_produk}</h3>
                  <div className="katalog-card-price">{formatRupiah(product.harga)}</div>
                </Link>
                <div className="katalog-card-store">
                  <img src="/images/stores/default-store.png" alt="" className="store-icon-img" />{" "}
                  {product.nama_toko}
                </div>
                <button className="btn-quick-add" onClick={() => tambahKeKeranjang(product)}>
                  {baruDitambah === product.id ? "✓ Ditambahkan" : "+ Keranjang"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="katalog-empty">
          <div className="katalog-empty-emoji">🔍</div>
          <h3>Produk tidak ditemukan</h3>
          <p>Coba ubah kata kunci pencarian atau pilih kategori yang berbeda.</p>
          <button className="btn-primary" onClick={resetFilter}>
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}
