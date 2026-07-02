"use client";

import React, { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/data";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function CartSidebar() {
  const router = useRouter();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
  } = useCart();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setIsCartOpen]);

  // Prevent scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  // if (!isCartOpen) return null;

  return (
    <div className={`cart-overlay ${isCartOpen ? "open" : ""}`} onClick={() => setIsCartOpen(false)}>
      <div
        className={`cart-sidebar ${isCartOpen ? "open" : ""}`}
        ref={sidebarRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-sidebar-header">
          <h2>Keranjang Belanja ({cartCount})</h2>
          <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>
            ✕
          </button>
        </div>

        <div className="cart-sidebar-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-emoji">🛒</div>
              <p>Keranjangmu masih kosong</p>
              <button
                className="btn-primary"
                onClick={() => setIsCartOpen(false)}
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div
                    className="cart-item-img"
                    style={{ background: item.bg_color }}
                  >
                    {item.image ? <img src={item.image} alt={item.nama_produk} className="cart-item-img" /> : <span className="cart-item-emoji">{item.emoji}</span>}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.nama_produk}</div>
                    <div className="cart-item-store">{item.nama_toko}</div>
                    <div className="cart-item-price">
                      {formatRupiah(item.harga)}
                    </div>
                    <div className="cart-item-actions">
                      <div className="cart-item-qty">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-sidebar-footer">
            <div className="cart-total-row">
              <span>Total Estimasi:</span>
              <span className="cart-total-price">{formatRupiah(cartTotal)}</span>
            </div>
            <p className="cart-footer-note">
              * Harga belum termasuk ongkir & biaya layanan
            </p>
            <div className="cart-footer-btns">
              <button
                className="btn-primary cart-checkout-btn"
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/checkout");
                }}
              >
                Checkout Sekarang
              </button>
              <button
                className="btn-ghost"
                onClick={() => setIsCartOpen(false)}
              >
                Lanjut Belanja
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
