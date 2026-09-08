import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * Panggung hero: foto sesajen & bunga dibingkai lengkung menyerupai relung
 * kori agung, berganti pelan dengan gerak zoom halus (Ken Burns).
 *
 * Pergantian foto murni animasi CSS — tidak butuh JavaScript, jadi tetap
 * hidup meski hydration lambat.
 *
 * Foto aslinya PNG 1024x1024 berukuran 0,5-0,8 MB. Lewat next/image semuanya
 * dikecilkan dan dikonversi ke format modern sesuai lebar tampil, supaya hero
 * tidak menyeret muatan megabyte.
 */
const SLIDES = [
  {
    src: "/images/products/banten-pejati.png",
    alt: "Banten pejati lengkap tersusun di atas dulang kayu berukir",
  },
  {
    src: "/images/products/canang-sari-harian.png",
    alt: "Canang sari berisi bunga jepun, mitir, dan pandan harum",
  },
  {
    src: "/images/products/sesajen-galungan.png",
    alt: "Rangkaian gebogan dan sesajen untuk Hari Raya Galungan",
  },
  {
    src: "/images/products/taledan-buah-segar.png",
    alt: "Taledan berisi buah segar untuk persembahan",
  },
];

const SLIDE_SIZES = "(max-width: 600px) 260px, (max-width: 900px) 280px, 340px";

const MEDALLIONS = [
  {
    src: "/images/products/canang-gede.png",
    className: "shrine-medallion medallion-1",
  },
  {
    src: "/images/products/dupa-harum-pandan.png",
    className: "shrine-medallion medallion-2",
  },
];

export function HeroShowcase() {
  return (
    <div className="hero-showcase">
      <div className="shrine-glow" aria-hidden="true" />

      <div className="hero-shrine">
        <div className="shrine-ring" aria-hidden="true" />

        <div className="shrine-frame">
          {SLIDES.map((slide, i) => (
            <Image
              key={slide.src}
              src={slide.src}
              // Hanya foto pertama yang diberi teks alternatif; sisanya
              // dekoratif dan berganti sendiri, jadi tidak perlu dibacakan.
              alt={i === 0 ? slide.alt : ""}
              aria-hidden={i === 0 ? undefined : true}
              fill
              sizes={SLIDE_SIZES}
              className="shrine-slide"
              style={{ "--i": i } as CSSProperties}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          ))}
          <div className="shrine-sheen" aria-hidden="true" />
        </div>

        {/* Ukiran emas di puncak lengkung */}
        <span className="shrine-crown" aria-hidden="true">
          ✦
        </span>
      </div>

      {MEDALLIONS.map((m) => (
        <div key={m.src} className={m.className} aria-hidden="true">
          <Image src={m.src} alt="" fill sizes="92px" />
        </div>
      ))}

      <div className="hero-visual-card float-card-1">
        <span>📍</span> Toko Terdekat
      </div>
      <div className="hero-visual-card float-card-2">
        <span>🤖</span> Asisten AI Pintar
      </div>
      <div className="hero-visual-card float-card-3">
        <span>💎</span> Harga Transparan
      </div>
    </div>
  );
}
