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

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <NearbyStores />
      <FeaturedProducts />
      <HowItWorks />
      <Testimonials />
      <Trust />
      <Articles />
      <Footer />
    </>
  );
}

