"use client";

import Link from "next/link";
import { useState } from "react";

export function FeaturedProducts() {
  const [filter, setFilter] = useState("Semua");

  const products = [
    { id: 1, slug: "canang-sari-harian", name: "Canang Sari Segar", price: 15000, store: "Toko Sari Ayu", rating: 4.9, sold: "2.1k", image: "/images/products/canang-sari-harian.png", color: "#FBF0DC" },
    { id: 2, slug: "dupa-harum-pandan", name: "Dupa Maharaja Pandan", price: 25000, store: "Baturiti Upakara", rating: 4.8, sold: "850", image: "/images/products/dupa-harum-pandan.png", color: "#E4F0EA" },
    { id: 3, slug: "dulang-kayu-cendana", name: "Dulang Fiber 30cm", price: 120000, store: "Griya Sesajen", rating: 4.9, sold: "340", image: "/images/products/dulang-kayu-cendana.png", color: "#FAE7E1" },
    { id: 4, slug: "buah-sesajen-komplit", name: "Paket Buah Pejati", price: 85000, store: "Pasar Seni Bali", rating: 4.7, sold: "120", image: "/images/products/buah-sesajen-komplit.png", color: "#FBF5DC" },
  ];

  return (
    <section className="products-section container" id="produk">
      <div className="section-row">
        <div className="section-header anim-fadeup" style={{ marginBottom: 0 }}>
          <div className="section-tag">Rekomendasi</div>
          <h2 className="section-title">Pilihan Produk Terbaik</h2>
          <p className="section-sub">Produk-produk dengan rating tinggi dan harga bersahabat.</p>
        </div>
        
        <div className="product-filter-tabs anim-fadeup stagger-1">
          <button 
            className={`filter-tab ${filter === "Semua" ? "active" : ""}`}
            onClick={() => setFilter("Semua")}
          >
            Semua
          </button>
          <button 
            className={`filter-tab ${filter === "Terlaris" ? "active" : ""}`}
            onClick={() => setFilter("Terlaris")}
          >
            Terlaris
          </button>
          <button 
            className={`filter-tab ${filter === "Diskon" ? "active" : ""}`}
            onClick={() => setFilter("Diskon")}
          >
            Diskon
          </button>
        </div>
      </div>

      <div className="products-grid" id="productsGrid">
        {products.map((prod, i) => (
          <div key={prod.id} className={`product-card anim-fadeup stagger-${(i % 5) + 1}`}>
            <button className="wishlist-btn">🤍</button>
            <Link href={`/katalog/${prod.slug}`}>
              <div className="product-card-img" style={{ background: prod.color, padding: 0 }}>
                <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Link>
            <div className="product-card-body">
              <div className="product-store">{prod.store}</div>
              <Link href={`/katalog/${prod.slug}`}>
                <h3 className="product-name">{prod.name}</h3>
              </Link>
              <div className="product-rating">
                <span className="stars">★★★★★</span>
                <span>{prod.rating} | {prod.sold} terjual</span>
              </div>
              <div className="product-footer">
                <span className="product-price">Rp {prod.price.toLocaleString('id-ID')}</span>
                <button className="product-add-btn">+</button>
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
