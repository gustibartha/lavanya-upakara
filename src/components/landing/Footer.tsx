import Link from "next/link";
import { CS_EMAIL, CS_WHATSAPP_DISPLAY, waLink } from "@/lib/kontak";

export function Footer() {
  return (
    <footer className="anim-fadeup">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">Lavanya<span>Upakara</span></div>
            <p>Marketplace khusus perlengkapan sembahyang Hindu. Mendekatkan umat dengan penjual terpercaya di sekitarnya.</p>
          </div>
          <div>
            <div className="footer-col-title">Pintasan</div>
            <ul className="footer-links">
              <li><Link href="/">Beranda</Link></li>
              <li><Link href="/#kategori">Kategori Produk</Link></li>
              <li><Link href="/#toko">Toko Terdekat</Link></li>
              <li><Link href="/#cara-kerja">Cara Kerja</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Layanan Kami</div>
            <ul className="footer-links">
              <li><Link href="/mitra">Daftar Mitra Toko</Link></li>
              <li><Link href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link></li>
              <li><Link href="/kebijakan-privasi">Kebijakan Privasi</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Hubungi Kami</div>
            <ul className="footer-links">
              {/* Bantuan diarahkan ke WhatsApp — itu kanal dukungan yang benar-benar ada. */}
              <li><a href={waLink()} target="_blank" rel="noopener noreferrer">Bantuan Layanan</a></li>
              <li><a href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp: {CS_WHATSAPP_DISPLAY}</a></li>
              <li><a href={`mailto:${CS_EMAIL}`}>Email: {CS_EMAIL}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Lavanya Upakara. Dibuat dengan 🙏 di Jakarta.</span>
          <span>Om Shanti Shanti Shanti Om</span>
        </div>
      </div>
    </footer>
  );
}

