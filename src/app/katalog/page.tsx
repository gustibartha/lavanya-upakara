import { Suspense } from "react";
import type { Metadata } from "next";
import KatalogContent from "./katalog-content";
import { ambilProdukKatalog } from "@/lib/katalog";

export const metadata: Metadata = {
  title: "Katalog Produk — Lavanya Upakara",
  description:
    "Canang, banten, dupa, dulang, hingga pakaian adat untuk sembahyang — dari toko mitra di Jabodetabek.",
};

// Dibaca dari database tiap permintaan supaya produk yang ditambah atau
// dinonaktifkan di /admin/produk langsung berlaku tanpa menunggu deploy.
export const dynamic = "force-dynamic";

export default async function KatalogPage() {
  const produk = await ambilProdukKatalog();

  return (
    <Suspense
      fallback={
        <div className="katalog-page">
          <div className="katalog-header">
            <h1 className="katalog-title">Katalog Produk</h1>
            <p className="katalog-subtitle">Memuat produk...</p>
          </div>
        </div>
      }
    >
      <KatalogContent produk={produk} />
    </Suspense>
  );
}
