import Link from "next/link";

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
              <li><a href="#">Daftar Mitra Toko</a></li>
              <li><a href="#">Syarat &amp; Ketentuan</a></li>
              <li><a href="#">Kebijakan Privasi</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Hubungi Kami</div>
            <ul className="footer-links">
              <li><a href="#">Bantuan Layanan</a></li>
              <li><a href="https://wa.me/628991905928" target="_blank" rel="noopener noreferrer">WhatsApp: +62 899-1905-928</a></li>
              <li><a href="#">Email: cs@lavanyaupakara.com</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Lavanya Upakara. Dibuat dengan 🙏 di Bali.</span>
          <span>Om Shanti Shanti Shanti Om</span>
        </div>
      </div>
    </footer>
  );
}

