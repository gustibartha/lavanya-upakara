import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatRupiah } from "@/lib/data";
import { ambilProdukBySlug, ambilProdukKatalog } from "@/lib/katalog";
import { ProductActions } from "./ProductActions";

// Produk bisa diubah atau dinonaktifkan dari panel admin kapan saja.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await ambilProdukBySlug(slug);
  if (!product) return { title: "Produk Tidak Ditemukan — Lavanya Upakara" };

  const title = `${product.nama_produk} — ${formatRupiah(product.harga)} | Lavanya Upakara`;
  return {
    title,
    description: product.deskripsi,
    openGraph: {
      title,
      description: product.deskripsi,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await ambilProdukBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = (await ambilProdukKatalog())
    .filter((p) => p.kategori_slug === product.kategori_slug && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="product-detail-page">
      <nav className="breadcrumb">
        <Link href="/">Beranda</Link>
        <span className="breadcrumb-sep">›</span>
        <Link href="/katalog">Katalog</Link>
        <span className="breadcrumb-sep">›</span>
        <Link href={`/katalog?kategori=${product.kategori_slug}`}>{product.kategori}</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{product.nama_produk}</span>
      </nav>

      <div className="product-detail">
        <div className="product-detail-img" style={{ background: product.bg_color }}>
          {product.image ? (
            <img src={product.image} alt={product.nama_produk} className="product-detail-img" />
          ) : (
            <span className="product-detail-emoji" aria-hidden="true">
              {product.emoji}
            </span>
          )}
          {product.populer && <span className="product-badge-popular">⭐ Produk Populer</span>}
        </div>

        <div className="product-detail-info">
          <div className="product-detail-category">{product.kategori}</div>
          <h1 className="product-detail-name">{product.nama_produk}</h1>
          <div className="product-detail-price">{formatRupiah(product.harga)}</div>

          <div className="product-detail-desc">
            <h3>Deskripsi Produk</h3>
            <p>{product.deskripsi}</p>
          </div>

          <div className="product-detail-store">
            <div className="product-store-header">
              <span className="product-store-emoji">🏪</span>
              <div>
                <div className="product-store-name">{product.nama_toko}</div>
                <div className="product-store-address">{product.alamat_toko}</div>
              </div>
            </div>
            <div className="product-store-links">
              <Link href={`/katalog?store=${product.store_id}`} className="product-store-link">
                Produk lain dari toko ini →
              </Link>
              <Link href={`/toko?id=${product.store_id}`} className="product-store-link">
                Lihat di Peta →
              </Link>
            </div>
          </div>

          <ProductActions product={product} />
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2 className="related-title">Produk Sejenis</h2>
          <div className="related-grid">
            {relatedProducts.map((rp) => (
              <Link key={rp.id} href={`/katalog/${rp.slug}`} className="katalog-card">
                <div className="katalog-card-img" style={{ background: rp.bg_color }}>
                  {rp.image ? (
                    <img src={rp.image} alt={rp.nama_produk} className="product-card-img" />
                  ) : (
                    <span className="katalog-card-emoji" aria-hidden="true">
                      {rp.emoji}
                    </span>
                  )}
                </div>
                <div className="katalog-card-body">
                  <h3 className="katalog-card-name">{rp.nama_produk}</h3>
                  <div className="katalog-card-price">{formatRupiah(rp.harga)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
