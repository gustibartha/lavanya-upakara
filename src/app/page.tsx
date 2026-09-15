import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Categories } from "@/components/landing/Categories";
import { NearbyStores } from "@/components/landing/NearbyStores";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { Trust } from "@/components/landing/Trust";
import { Articles } from "@/components/landing/Articles";
import { Footer } from "@/components/landing/Footer";
import { HariRayaBanner } from "@/components/store/HariRayaBanner";
import { OrnamentDivider, PolengStrip } from "@/components/motion/Ornament";

// Articles (bagian "Artikel Terbaru") membaca database secara langsung.
// Tanpa ini beranda dirender statis sekali saat build, dan artikel baru
// yang diterbitkan lewat /admin/artikel baru muncul di deploy berikutnya —
// bukan seketika. Konsekuensinya: beranda ikut dirender ulang tiap
// permintaan, bukan disajikan dari cache statis. Untuk skala situs ini
// dampaknya kecil; kalau lalu lintas beranda jadi sangat besar, ISR
// (`export const revalidate`) adalah jalan tengah yang bisa dipakai nanti
// tanpa mengubah cara kerja bagian lain di halaman ini.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Navbar />
      <HariRayaBanner />
      <Hero />
      <Categories />
      <div className="container">
        <OrnamentDivider />
      </div>
      <NearbyStores />
      <FeaturedProducts />
      <PolengStrip />
      <HowItWorks />
      <Testimonials />
      <Trust />
      <Articles />
      <Footer />
    </>
  );
}
