import { Suspense } from "react";
import KatalogContent from "./katalog-content";

export default function KatalogPage() {
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
      <KatalogContent />
    </Suspense>
  );
}
