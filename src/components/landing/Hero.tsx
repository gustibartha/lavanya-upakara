import Link from "next/link";
import { CountUp } from "@/components/motion/CountUp";
import { DupaSmoke } from "@/components/motion/DupaSmoke";
import { HeroShowcase } from "@/components/landing/HeroShowcase";

/** Judul hero dipecah per kata agar bisa naik satu-satu seperti irama tabuh. */
const TITLE_WORDS: { text: string; accent?: boolean; em?: boolean }[] = [
  { text: "Kebutuhan" },
  { text: "Sembahyang," },
  { text: "Satu", em: true, accent: true },
  { text: "Ketukan", em: true, accent: true },
  { text: "dari" },
  { text: "Layarmu" },
];

export function Hero() {
  return (
    <section className="hero container">
      <div className="hero-bg-pattern"></div>
      <DupaSmoke />
      <div className="hero-inner">
        <div className="hero-text">
          <div className="hero-badge anim-fadeup">
            <div className="hero-badge-dot"></div>
            Marketplace Sarana Upacara #1 di Jabodetabek
          </div>
          <h1 className="hero-title">
            {TITLE_WORDS.map((word, i) => (
              <span
                key={i}
                className={`word${word.accent ? " word-accent" : ""}`}
                style={{ "--w": i } as React.CSSProperties}
              >
                {word.em ? <em>{word.text}</em> : word.text}
                {i < TITLE_WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>
          <p className="hero-desc anim-fadeup stagger-1">
            Platform khusus perlengkapan sembahyang Hindu. Temukan toko terdekat, pesan langsung, dan gunakan fitur Asisten AI untuk membantu merencanakan kebutuhan upacara Anda.
          </p>

          <div className="hero-search anim-fadeup stagger-2">
            <span className="hero-search-icon">🔍</span>
            <input type="text" className="hero-search-input" placeholder="Cari canang, dupa, buah..." />
            <button className="hero-search-btn">Cari</button>
          </div>

          <div className="hero-tags anim-fadeup stagger-3">
            <span className="hero-tag-label">Pencarian Populer:</span>
            <Link href="/katalog" className="hero-tag">Canang Sari</Link>
            <Link href="/katalog" className="hero-tag">Dupa Maharaja</Link>
            <Link href="/katalog" className="hero-tag">Dulang Fiber</Link>
          </div>

          <div className="hero-stats anim-fadeup stagger-4">
            <div className="hero-stat">
              <span className="hero-stat-num">
                <CountUp to={500} suffix="+" />
              </span>
              <span className="hero-stat-label">Toko Terdaftar</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-num">
                <CountUp to={1.2} decimals={1} suffix="K" />
              </span>
              <span className="hero-stat-label">Produk Tersedia</span>
            </div>
          </div>
        </div>

        <div className="hero-visual anim-fadeup stagger-4" data-reveal="scale">
          <HeroShowcase />
        </div>
      </div>
    </section>
  );
}
