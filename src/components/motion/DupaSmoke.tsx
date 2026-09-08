import type { CSSProperties } from "react";

/** Asap dupa yang membubung pelan di latar hero. */
const WISPS = [
  { x: "12%", w: 220, dur: 22, delay: 0,   drift: 60 },
  { x: "28%", w: 150, dur: 28, delay: 5,   drift: -45 },
  { x: "46%", w: 260, dur: 25, delay: 11,  drift: 80 },
  { x: "64%", w: 180, dur: 30, delay: 3,   drift: -70 },
  { x: "81%", w: 240, dur: 24, delay: 15,  drift: 50 },
  { x: "93%", w: 160, dur: 27, delay: 8.5, drift: -35 },
];

export function DupaSmoke() {
  return (
    <div className="dupa-smoke" aria-hidden="true">
      {WISPS.map((w, i) => (
        <span
          key={i}
          className="dupa-wisp"
          style={
            {
              "--x": w.x,
              "--w": `${w.w}px`,
              "--dur": `${w.dur}s`,
              "--delay": `${w.delay}s`,
              "--drift": `${w.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
