import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Lavanya Upakara — Sarana Sembahyang, Mudah & Dekat",
  description: "Marketplace khusus perlengkapan sembahyang Hindu — temukan toko terdekat, cek harga transparan, dan pesan canang hingga dulang langsung ke pintu rumahmu.",
};

import { CartProvider } from "@/context/CartContext";
import { CartSidebar } from "@/components/store/CartSidebar";
import { ChatWidget } from "@/components/store/ChatWidget";

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
          {children}
          <CartSidebar />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
