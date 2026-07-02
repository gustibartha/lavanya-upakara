"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  products,
  categories,
  getStoreById,
  formatRupiah,
} from "@/lib/data";
import { useCart } from "@/context/CartContext";

export default function KatalogContent() {
  const searchParams = useSearchParams();
  const initialKategori = searchParams.get("kategori") || "semua";

  const [activeKategori, setActiveKategori] = useState(initialKategori);
  const [searchQuery, setSearchQuery] = useState("");

  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (activeKategori !== "semua") {
      result = result.filter((p) => p.kategori_slug === activeKategori);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.nama_produk.toLowerCase().includes(q) ||
          p.kategori.toLowerCase().includes(q) ||
          p.deskripsi.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeKategori, searchQuery]);

  return (
    <div className="katalog-page">
      {/* Header */}
      <div className="katalog-header">
        <h1 className="katalog-title">Katalog Produk</h1>
        <p className="katalog-subtitle">
          Temukan perlengkapan sembahyang yang kamu butuhkan dari penjual
          terpercaya di sekitarmu.
        </p>
      </div>

      {/* Search Bar */}
      <div className="katalog-search-wrap">
        <div className="katalog-search">
          <span className="katalog-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Cari canang, dulang, dupa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="katalog-search-input"
          />
          {searchQuery && (
            <button
              className="katalog-search-clear"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="katalog-filters">
        <button
          className={`filter-pill ${activeKategori === "semua" ? "active" : ""}`}
          onClick={() => setActiveKategori("semua")}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-pill ${activeKategori === cat.slug ? "active" : ""}`}
            onClick={() => setActiveKategori(cat.slug)}
          >
            {cat.emoji} {cat.nama}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="katalog-results-info">
        <span>
          Menampilkan <strong>{filteredProducts.length}</strong> produk
          {activeKategori !== "semua" && (
            <>
              {" "}
              dalam{" "}
              <strong>
                {categories.find((c) => c.slug === activeKategori)?.nama}
              </strong>
            </>
          )}
        </span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="katalog-grid">
          {filteredProducts.map((product) => {
            const store = getStoreById(product.store_id);
            return (
              <div key={product.id} className="katalog-card">
                <Link href={`/katalog/${product.slug}`}>
                  <div
                    className="katalog-card-img"
                    style={{ background: product.bg_color }}
                  >
                    <img src={product.image} alt={product.nama_produk} className="product-card-img" />
                    {product.populer && (
                      <span className="katalog-card-badge">Populer</span>
                    )}
                  </div>
                </Link>
                <div className="katalog-card-body">
                  <Link href={`/katalog/${product.slug}`}>
                    <div className="katalog-card-category">
                      {product.kategori}
                    </div>
                    <h3 className="katalog-card-name">{product.nama_produk}</h3>
                    <div className="katalog-card-price">
                      {formatRupiah(product.harga)}
                    </div>
                  </Link>
                  {store && (
                    <div className="katalog-card-store">
                      {store?.image ? <img src={store.image} alt={store.nama_toko} className="store-icon-img" /> : store?.emoji} {store.nama_toko}
                    </div>
                  )}
                  <button
                    className="btn-quick-add"
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(
                        { ...product, nama_toko: store?.nama_toko },
                        1
                      );
                    }}
                  >
                    + Keranjang
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="katalog-empty">
          <div className="katalog-empty-emoji">🔍</div>
          <h3>Produk tidak ditemukan</h3>
          <p>
            Coba ubah kata kunci pencarian atau pilih kategori yang berbeda.
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              setSearchQuery("");
              setActiveKategori("semua");
            }}
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}
