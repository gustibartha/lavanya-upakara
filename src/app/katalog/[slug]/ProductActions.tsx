"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { ProdukKatalog } from "@/lib/katalog";

const MAKS = 99;

export function ProductActions({ product }: { product: ProdukKatalog }) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);

  const item = { ...product, image: product.image ?? undefined };

  const handleAddToCart = () => {
    addToCart(item, quantity);
  };

  const handleBuyNow = () => {
    addToCart(item, quantity);
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="product-actions-container">
      <div className="product-qty-selector">
        <label htmlFor="qty">Jumlah:</label>
        <div className="qty-controls">
          <button
            aria-label="Kurangi jumlah"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </button>
          <input id="qty" type="number" value={quantity} readOnly />
          <button
            aria-label="Tambah jumlah"
            onClick={() => setQuantity(Math.min(MAKS, quantity + 1))}
          >
            +
          </button>
        </div>
      </div>

      <div className="product-detail-actions">
        <button className="btn-primary product-btn-cart" onClick={handleAddToCart}>
          🛒 Tambah ke Keranjang
        </button>
        <button className="btn-ghost product-btn-buy" onClick={handleBuyNow}>
          Beli Sekarang →
        </button>
      </div>
    </div>
  );
}
