import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./motion.css";
import { siteUrl } from "@/lib/site-url";

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const jakarta = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const DESKRIPSI =
  "Marketplace khusus perlengkapan sembahyang Hindu — temukan toko terdekat, cek harga transparan, dan pesan canang hingga dulang langsung ke pintu rumahmu.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "Lavanya Upakara — Sarana Sembahyang, Mudah & Dekat",
  description: DESKRIPSI,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Lavanya Upakara",
    title: "Lavanya Upakara — Sarana Sembahyang, Mudah & Dekat",
    description: DESKRIPSI,
    images: [{ url: "/images/categories/sesajen.png" }],
  },
};

import { CartProvider } from "@/context/CartContext";
import { CartSidebar } from "@/components/store/CartSidebar";
import { ChatWidget } from "@/components/store/ChatWidget";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { JepunRain } from "@/components/motion/JepunRain";
import { ScrollProgress } from "@/components/motion/Ornament";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${jakarta.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          <ScrollProgress />
          <JepunRain />
          {children}
          <CartSidebar />
          <ChatWidget />
        </CartProvider>
        <MotionProvider />
      </body>
    </html>
  );
}
