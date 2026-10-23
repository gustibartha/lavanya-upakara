import type { MetadataRoute } from "next";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ambilProdukKatalog } from "@/lib/katalog";
import { siteUrl } from "@/lib/site-url";

// Produk dan artikel bisa ditambah dari panel admin kapan saja.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [produk, artikel] = await Promise.all([
    ambilProdukKatalog(),
    db
      .select({ slug: articles.slug, created_at: articles.created_at })
      .from(articles)
      .where(eq(articles.aktif, true)),
  ]);

  const halaman: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/katalog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/toko`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/edukasi`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/mitra`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/syarat-ketentuan`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/kebijakan-privasi`, changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...halaman,
    ...produk.map((p) => ({
      url: `${base}/katalog/${p.slug}`,
      lastModified: p.created_at,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: p.image ? [`${base}${p.image}`] : undefined,
    })),
    ...artikel.map((a) => ({
      url: `${base}/edukasi/${a.slug}`,
      lastModified: a.created_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
