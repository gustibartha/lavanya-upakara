import Image from "next/image";

/** Pembatas bermotif ukiran patra — garis emas yang terbuka saat masuk layar. */
export function OrnamentDivider() {
  return (
    <div className="ornament-divider" aria-hidden="true">
      <span className="ornament-line" />
      <span className="ornament-patra">
        <Image src="/images/motion/patra-bali.png" alt="" width={176} height={89} />
      </span>
      <span className="ornament-line" />
    </div>
  );
}

/** Pita poleng — kain hitam-putih sakral, bergeser pelan tanpa henti. */
export function PolengStrip() {
  return <div className="poleng-strip" aria-hidden="true" />;
}

/** Benang emas penanda posisi scroll. */
export function ScrollProgress() {
  return <div className="scroll-progress" aria-hidden="true" />;
}
