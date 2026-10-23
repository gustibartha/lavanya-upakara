"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/data";
import { useFavorites } from "@/lib/use-favorites";
import type { ProdukKatalog } from "@/lib/katalog";

const TAB = ["Populer", "Termurah", "Terbaru"] as const;
type Tab = (typeof TAB)[number];

export function FeaturedProducts({ produk }: { produk: ProdukKatalog[] }) {
  const [filter, setFilter] = useState<Tab>("Populer");
  const { addToCart } = useCart();

  // Belum ada wishlist di server, jadi tombol hati ini menyimpan pilihan
  // di perangkat pembeli saja — daripada dibiarkan mati.
  const { favorites, toggleFavorite } = useFavorites();

  const tampil = useMemo(() => {
    if (filter === "Termurah") return [...produk].sort((a, b) => a.harga - b.harga).slice(0, 4);
    if (filter === "Terbaru")
      return [...produk].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 4);
    const populer = produk.filter((p) => p.populer);
    return (populer.length >= 4 ? populer : [...populer, ...produk.filter((p) => !p.populer)]).slice(0, 4);
  }, [produk, filter]);

  if (produk.length === 0) return null;

  return (
    <section className="products-section container" id="produk">
      <div className="section-row">
        <div className="section-header anim-fadeup" data-reveal="left" style={{ marginBottom: 0 }}>
          <div className="section-tag">Rekomendasi</div>
          <h2 className="section-title">Pilihan Produk Terbaik</h2>
          <p className="section-sub">Sarana upacara pilihan dari toko-toko mitra kami.</p>
        </div>

        <div className="product-filter-tabs anim-fadeup stagger-1">
          {TAB.map((t) => (
            <button
              key={t}
              className={`filter-tab ${filter === t ? "active" : ""}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid" id="productsGrid">
        {tampil.map((prod, i) => (
          <div key={prod.id} className={`product-card anim-fadeup stagger-${(i % 5) + 1}`}>
            <button
              className="wishlist-btn"
              onClick={() => toggleFavorite(prod.slug)}
              aria-pressed={favorites.includes(prod.slug)}
              aria-label={
                favorites.includes(prod.slug)
                  ? `Hapus ${prod.nama_produk} dari favorit`
                  : `Simpan ${prod.nama_produk} ke favorit`
              }
              title={favorites.includes(prod.slug) ? "Hapus dari favorit" : "Simpan ke favorit"}
            >
              {favorites.includes(prod.slug) ? "❤️" : "🤍"}
            </button>
            <Link href={`/katalog/${prod.slug}`}>
              <div className="product-card-img" style={{ background: prod.bg_color, padding: 0 }}>
                {prod.image ? (
                  <img
                    src={prod.image}
                    alt={prod.nama_produk}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span className="katalog-card-emoji" aria-hidden="true">{prod.emoji}</span>
                )}
              </div>
            </Link>
            <div className="product-card-body">
              <div className="product-store">{prod.nama_toko}</div>
              <Link href={`/katalog/${prod.slug}`}>
                <h3 className="product-name">{prod.nama_produk}</h3>
              </Link>
              <div className="product-rating">
                <span>{prod.kategori}</span>
              </div>
              <div className="product-footer">
                <span className="product-price">{formatRupiah(prod.harga)}</span>
                <button
                  className="product-add-btn"
                  onClick={() => addToCart({ ...prod, image: prod.image ?? undefined }, 1)}
                  aria-label={`Tambah ${prod.nama_produk} ke keranjang`}
                  title="Tambah ke keranjang"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "3rem" }} className="anim-fadeup">
        <Link href="/katalog" className="btn btn-primary btn-lg">Jelajahi Semua Produk</Link>
      </div>
    </section>
  );
}
