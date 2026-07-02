"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";

interface ProductActionsProps {
  product: any;
  store: any;
}

export function ProductActions({ product, store }: ProductActionsProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({ ...product, nama_toko: store?.nama_toko }, quantity);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, nama_toko: store?.nama_toko }, quantity);
    setIsCartOpen(true);
  };

  return (
    <div className="product-actions-container">
      <div className="product-qty-selector">
        <label>Jumlah:</label>
        <div className="qty-controls">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <input 
            type="number" 
            value={quantity} 
            readOnly
          />
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
      </div>

      <div className="product-detail-actions">
        <button 
          className="btn-primary product-btn-cart"
          onClick={handleAddToCart}
        >
          🛒 Tambah ke Keranjang
        </button>
        <button 
          className="btn-ghost product-btn-buy"
          onClick={handleBuyNow}
        >
          Beli Sekarang →
        </button>
      </div>
    </div>
  );
}
