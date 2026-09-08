"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = ".anim-fadeup, [data-reveal], .ornament-divider";

/**
 * Elemen dianggap sudah selesai kalau posisinya berada di viewport ATAU sudah
 * terlewat di atasnya — misal saat browser memulihkan posisi scroll setelah
 * refresh. Tanpa ini, bagian yang terlewat baru muncul kalau di-scroll balik.
 */
function isAtOrAboveViewport(el: Element) {
  const vh = window.innerHeight || document.documentElement.clientHeight;
  // Tinggi viewport bisa 0 kalau halaman diaktifkan di tab latar. Saat tinggi
  // tak terukur, semua dianggap selesai supaya konten tidak pernah tersembunyi
  // menunggu observer yang belum bisa jalan.
  if (!vh) return true;
  return el.getBoundingClientRect().top < vh;
}

/**
 * Mesin gerak global:
 *  - Reveal saat elemen masuk viewport (menggantikan animasi on-load)
 *  - Sorotan cahaya mengikuti kursor di atas kartu
 *  - Parallax lembut pada visual hero
 *  - Benang emas progress scroll
 *
 * HTML dari server dikirim dalam keadaan terlihat penuh. Mode gerak baru
 * dinyalakan di sini (atribut `data-motion` pada <html>) setelah semua elemen
 * yang sudah berada di layar ditandai `in-view` lebih dulu — jadi tidak ada
 * kedipan, dan kalau JS gagal jalan halaman tetap terbaca seperti biasa.
 */
export function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- 1. Scroll reveal ---------- */
    const seen = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    const scan = () => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        // Yang sudah tampak di layar langsung ditandai selesai supaya tidak
        // sempat disembunyikan lalu dimunculkan lagi.
        if (reduced || isAtOrAboveViewport(el)) {
          el.classList.add("in-view");
          return;
        }
        observer.observe(el);
      });
    };

    scan();
    root.dataset.motion = "on";

    // Konten yang dirender belakangan (filter produk, hasil fetch) ikut terpantau.
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    if (reduced) {
      return () => {
        observer.disconnect();
        mutations.disconnect();
        delete root.dataset.motion;
      };
    }

    /* ---------- 2. Sorotan kursor pada kartu ---------- */
    const SPOTLIGHT = ".cat-card, .store-card, .article-card";
    let spotlightFrame = 0;

    const onPointerMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest?.(SPOTLIGHT) as
        | HTMLElement
        | null;
      if (!card || spotlightFrame) return;
      spotlightFrame = requestAnimationFrame(() => {
        spotlightFrame = 0;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    };
    document.addEventListener("pointermove", onPointerMove, { passive: true });

    /* ---------- 3. Parallax hero ---------- */
    const hero = document.querySelector<HTMLElement>(".hero");
    const heroVisual = document.querySelector<HTMLElement>(".hero-visual");
    let heroFrame = 0;

    const onHeroMove = (e: PointerEvent) => {
      if (!hero || !heroVisual || heroFrame) return;
      heroFrame = requestAnimationFrame(() => {
        heroFrame = 0;
        const rect = hero.getBoundingClientRect();
        heroVisual.style.setProperty(
          "--px",
          ((e.clientX - rect.left) / rect.width - 0.5).toFixed(3),
        );
        heroVisual.style.setProperty(
          "--py",
          ((e.clientY - rect.top) / rect.height - 0.5).toFixed(3),
        );
      });
    };
    const resetHero = () => {
      heroVisual?.style.setProperty("--px", "0");
      heroVisual?.style.setProperty("--py", "0");
    };
    hero?.addEventListener("pointermove", onHeroMove, { passive: true });
    hero?.addEventListener("pointerleave", resetHero);

    /* ---------- 4. Progress scroll ---------- */
    const bar = document.querySelector<HTMLElement>(".scroll-progress");
    let scrollFrame = 0;

    const paintProgress = () => {
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.setProperty("--p", p.toFixed(4));
    };

    const onScroll = () => {
      if (!bar || scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        paintProgress();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Nilai awal ditulis langsung, tidak lewat rAF — di tab yang tersembunyi
    // rAF tidak pernah jalan dan bar akan tertinggal kosong.
    paintProgress();

    return () => {
      observer.disconnect();
      mutations.disconnect();
      document.removeEventListener("pointermove", onPointerMove);
      hero?.removeEventListener("pointermove", onHeroMove);
      hero?.removeEventListener("pointerleave", resetHero);
      window.removeEventListener("scroll", onScroll);
      if (spotlightFrame) cancelAnimationFrame(spotlightFrame);
      if (heroFrame) cancelAnimationFrame(heroFrame);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
