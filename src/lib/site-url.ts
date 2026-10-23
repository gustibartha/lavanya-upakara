// Alamat publik situs untuk sitemap, robots.txt, dan tautan pratinjau
// (og:image). Saat domain kustom dipasang, isi NEXT_PUBLIC_SITE_URL —
// tanpa itu dipakai domain produksi Vercel.
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
