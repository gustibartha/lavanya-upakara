import Link from "next/link";
import { notFound } from "next/navigation";
import {
  products,
  getProductBySlug,
  getStoreById,
  getProductsByCategory,
  formatRupiah,
} from "@/lib/data";

import { ProductActions } from "./ProductActions";

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const store = getStoreById(product.store_id);
  const relatedProducts = getProductsByCategory(product.kategori_slug)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Beranda</Link>
        <span className="breadcrumb-sep">›</span>
        <Link href="/katalog">Katalog</Link>
        <span className="breadcrumb-sep">›</span>
        <Link href={`/katalog?kategori=${product.kategori_slug}`}>
          {product.kategori}
        </Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{product.nama_produk}</span>
      </nav>

      {/* Product Detail */}
      <div className="product-detail">
        <div
          className="product-detail-img"
          style={{ background: product.bg_color }}
        >
          <img src={product.image} alt={product.nama_produk} className="product-detail-img" />
          {product.populer && (
            <span className="product-badge-popular">⭐ Produk Populer</span>
          )}
        </div>

        <div className="product-detail-info">
          <div className="product-detail-category">{product.kategori}</div>
          <h1 className="product-detail-name">{product.nama_produk}</h1>
          <div className="product-detail-price">
            {formatRupiah(product.harga)}
          </div>

          <div className="product-detail-desc">
            <h3>Deskripsi Produk</h3>
            <p>{product.deskripsi}</p>
          </div>

          {store && (
            <div className="product-detail-store">
              <div className="product-store-header">
                <span className="product-store-emoji">{store.emoji}</span>
                <div>
                  <div className="product-store-name">{store.nama_toko}</div>
                  <div className="product-store-address">{store.alamat}</div>
                </div>
              </div>
              <Link href="/toko" className="product-store-link">
                Lihat di Peta →
              </Link>
            </div>
          )}

          <ProductActions product={product} store={store} />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2 className="related-title">Produk Sejenis</h2>
          <div className="related-grid">
            {relatedProducts.map((rp) => (
              <Link
                key={rp.id}
                href={`/katalog/${rp.slug}`}
                className="katalog-card"
              >
                <div
                  className="katalog-card-img"
                  style={{ background: rp.bg_color }}
                >
                  <img src={rp.image} alt={rp.nama_produk} className="product-card-img" />
                </div>
                <div className="katalog-card-body">
                  <h3 className="katalog-card-name">{rp.nama_produk}</h3>
                  <div className="katalog-card-price">
                    {formatRupiah(rp.harga)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
