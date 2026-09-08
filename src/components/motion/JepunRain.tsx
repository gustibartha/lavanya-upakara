import type { CSSProperties } from "react";

/**
 * Hujan bunga jepun (kamboja) — bunga yang selalu hadir di sesajen Bali.
 * Nilai gerak sengaja ditulis tetap (bukan Math.random) supaya render di
 * server dan di browser identik dan tidak memicu hydration mismatch.
 */
const PETALS = [
  { x: "4%",  size: 20, dur: 21, delay: 0,    sway: 70,  op: 0.5,  tint: "putih" },
  { x: "13%", size: 15, dur: 27, delay: 6.5,  sway: -55, op: 0.38, tint: "emas" },
  { x: "22%", size: 24, dur: 18, delay: 12,   sway: 90,  op: 0.55, tint: "putih" },
  { x: "31%", size: 13, dur: 30, delay: 3,    sway: -40, op: 0.32, tint: "putih" },
  { x: "43%", size: 22, dur: 23, delay: 16,   sway: 65,  op: 0.48, tint: "emas" },
  { x: "52%", size: 17, dur: 26, delay: 9,    sway: -80, op: 0.4,  tint: "putih" },
  { x: "61%", size: 26, dur: 19, delay: 21,   sway: 50,  op: 0.52, tint: "putih" },
  { x: "70%", size: 14, dur: 29, delay: 1.5,  sway: -65, op: 0.35, tint: "emas" },
  { x: "79%", size: 21, dur: 22, delay: 14,   sway: 85,  op: 0.5,  tint: "putih" },
  { x: "88%", size: 16, dur: 25, delay: 7.5,  sway: -45, op: 0.42, tint: "putih" },
  { x: "95%", size: 19, dur: 20, delay: 18,   sway: 60,  op: 0.45, tint: "emas" },
];

function Petal({ tint }: { tint: string }) {
  const petal = tint === "emas" ? "#F6E2AE" : "#FFFDF6";
  const edge = tint === "emas" ? "#E8B84A" : "#F3E4C4";
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <g fill={petal} stroke={edge} strokeWidth="0.6">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="20"
            cy="12"
            rx="6.4"
            ry="10"
            transform={`rotate(${deg} 20 20)`}
          />
        ))}
      </g>
      <circle cx="20" cy="20" r="4.6" fill="#F2C64B" opacity="0.9" />
    </svg>
  );
}

export function JepunRain() {
  return (
    <div className="jepun-field" aria-hidden="true">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="jepun"
          style={
            {
              "--x": p.x,
              "--size": `${p.size}px`,
              "--dur": `${p.dur}s`,
              "--delay": `${p.delay}s`,
              "--sway": `${p.sway}px`,
              "--op": p.op,
            } as CSSProperties
          }
        >
          <Petal tint={p.tint} />
        </span>
      ))}
    </div>
  );
}
