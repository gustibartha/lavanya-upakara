import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Categories } from "@/components/landing/Categories";
import { NearbyStores } from "@/components/landing/NearbyStores";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Trust } from "@/components/landing/Trust";
import { Articles } from "@/components/landing/Articles";
import { Footer } from "@/components/landing/Footer";
import { HariRayaBanner } from "@/components/store/HariRayaBanner";
import { OrnamentDivider, PolengStrip } from "@/components/motion/Ornament";
import { ambilProdukKatalog, ambilTokoUnggulan, hitungKatalog } from "@/lib/katalog";

// Beranda menampilkan angka, produk, toko, dan artikel langsung dari
// database, jadi dirender tiap permintaan — perubahan di panel admin
// langsung terlihat tanpa menunggu deploy. Kalau lalu lintas beranda jadi
// sangat besar, ISR (`export const revalidate`) adalah jalan tengahnya.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [angka, produk, toko] = await Promise.all([
    hitungKatalog(),
    ambilProdukKatalog(),
    ambilTokoUnggulan(4),
  ]);

  return (
    <>
      <Navbar />
      <HariRayaBanner />
      <Hero jumlahToko={angka.toko} jumlahProduk={angka.produk} />
      <Categories jumlahPerKategori={angka.perKategori} />
      <div className="container">
        <OrnamentDivider />
      </div>
      <NearbyStores toko={toko} />
      <FeaturedProducts produk={produk} />
      <PolengStrip />
      <HowItWorks />
      <Trust />
      <Articles />
      <Footer />
    </>
  );
}
