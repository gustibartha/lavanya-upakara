"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Nilai akhir yang dituju. */
  to: number;
  /** Jumlah angka di belakang koma. */
  decimals?: number;
  suffix?: string;
  /** Durasi hitung dalam milidetik. */
  duration?: number;
  className?: string;
};

const format = (value: number, decimals: number) =>
  value.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/**
 * Angka statistik yang berhitung naik saat pertama kali terlihat.
 *
 * Nilai akhir sudah dirender di HTML awal, jadi tanpa JS (atau bila pengguna
 * meminta reduced motion) angkanya tetap benar. Animasi menulis langsung ke
 * DOM supaya tidak memicu render React tiap frame.
 */
export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  duration = 1600,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const write = (value: number) => {
      node.textContent = `${format(value, decimals)}${suffix}`;
    };

    let frame = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo — cepat di awal lalu melandai, terasa "mendarat" halus.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      write(to * eased);
      if (t < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        write(0);
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      write(to);
    };
  }, [to, decimals, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {format(to, decimals)}
      {suffix}
    </span>
  );
}
