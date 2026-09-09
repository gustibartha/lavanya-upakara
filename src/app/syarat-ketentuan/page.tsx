import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { CS_EMAIL, CS_WHATSAPP_DISPLAY, waLink } from "@/lib/kontak";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — Lavanya Upakara",
  description:
    "Ketentuan penggunaan layanan Lavanya Upakara: akun, pemesanan, pembayaran, pengiriman, pembatalan, dan tanggung jawab para pihak.",
};

export default function SyaratKetentuanPage() {
  return (
    <LegalPage
      judul="Syarat & Ketentuan"
      ringkasan="Ketentuan ini mengatur penggunaan situs dan layanan Lavanya Upakara. Dengan membuat akun atau melakukan pemesanan, Anda dianggap telah membaca dan menyetujuinya."
      terakhirDiperbarui="9 September 2026"
    >
      <section>
        <h2>1. Definisi</h2>
        <ul>
          <li><strong>Layanan</strong> — situs dan seluruh fitur Lavanya Upakara.</li>
          <li><strong>Pengguna</strong> — siapa pun yang mengakses atau memakai Layanan.</li>
          <li><strong>Mitra Toko</strong> — penjual terdaftar yang menyediakan sarana upacara.</li>
          <li><strong>Pesanan</strong> — permintaan pembelian yang dibuat Pengguna melalui Layanan.</li>
        </ul>
      </section>

      <section>
        <h2>2. Peran Lavanya Upakara</h2>
        <p>
          Lavanya Upakara adalah <strong>perantara</strong> yang mempertemukan
          Pengguna dengan Mitra Toko di wilayah Jabodetabek. Barang dijual dan
          disiapkan oleh Mitra Toko, bukan oleh kami.
        </p>
        <p>
          Karena itu ketersediaan, mutu, kesegaran, dan kelengkapan sarana
          upacara merupakan tanggung jawab Mitra Toko yang bersangkutan. Kami
          melakukan verifikasi saat pendaftaran mitra dan membantu penyelesaian
          bila terjadi keluhan, tetapi kami tidak memproduksi barangnya sendiri.
        </p>
      </section>

      <section>
        <h2>3. Akun Pengguna</h2>
        <ul>
          <li>Pendaftaran memerlukan nama, alamat email, nomor WhatsApp aktif, dan kata sandi.</li>
          <li>Data yang Anda isikan harus benar dan menjadi tanggung jawab Anda untuk diperbarui.</li>
          <li>Jagalah kerahasiaan kata sandi. Aktivitas yang terjadi melalui akun Anda dianggap dilakukan oleh Anda.</li>
          <li>Segera hubungi kami bila Anda menduga akun dipakai pihak lain.</li>
          <li>Kami dapat menangguhkan akun yang terbukti melakukan penipuan atau merugikan Mitra Toko maupun Pengguna lain.</li>
        </ul>
      </section>

      <section>
        <h2>4. Pemesanan dan Harga</h2>
        <ul>
          <li>Harga ditampilkan dalam Rupiah dan ditetapkan oleh Mitra Toko.</li>
          <li>Harga dapat berubah sewaktu-waktu, namun perubahan tidak berlaku untuk pesanan yang sudah dibuat.</li>
          <li>Pesanan dianggap sah setelah Anda menerima nomor pesanan dan dapat dipantau di menu Riwayat.</li>
          <li>Bila barang ternyata habis setelah pesanan masuk, Mitra Toko atau kami akan menghubungi Anda untuk penggantian atau pembatalan.</li>
        </ul>
      </section>

      <section>
        <h2>5. Pembayaran</h2>
        <p>Tersedia dua cara pembayaran:</p>
        <ul>
          <li><strong>Bayar di Tempat (COD)</strong> — dibayar tunai saat barang diterima atau diambil.</li>
          <li>
            <strong>Pembayaran online</strong> melalui <strong>Midtrans</strong>{" "}
            (QRIS, transfer bank/virtual account, dan dompet digital).
          </li>
        </ul>
        <p>
          Untuk pembayaran online, data kartu maupun kredensial perbankan Anda
          diproses langsung oleh Midtrans dan <strong>tidak pernah tersimpan di
          server kami</strong>. Status lunas ditentukan oleh notifikasi resmi
          dari Midtrans, bukan oleh tampilan di layar.
        </p>
        <p>
          Bila dana sudah terpotong namun status pesanan belum berubah dalam
          1×24 jam, hubungi kami dengan menyertakan nomor pesanan.
        </p>
      </section>

      <section>
        <h2>6. Pengiriman dan Pengambilan</h2>
        <ul>
          <li>Anda dapat memilih ambil sendiri di toko (pickup) atau diantar kurir mitra.</li>
          <li>Perkiraan waktu tiba bersifat estimasi dan dapat terpengaruh cuaca, lalu lintas, serta ketersediaan kurir.</li>
          <li>Pastikan alamat dan nomor WhatsApp yang Anda isi benar. Kegagalan pengiriman akibat alamat keliru berada di luar tanggung jawab kami.</li>
          <li>Sarana upacara tertentu bersifat mudah rusak. Periksa barang saat diterima dan laporkan pada hari yang sama bila ada masalah.</li>
        </ul>
      </section>

      <section>
        <h2>7. Pembatalan dan Pengembalian Dana</h2>
        <ul>
          <li>Pesanan dapat dibatalkan selama statusnya masih “Menunggu Konfirmasi”.</li>
          <li>Setelah Mitra Toko mulai menyiapkan pesanan, pembatalan bergantung pada kebijakan toko tersebut.</li>
          <li>Barang segar seperti canang, bunga, dan buah pada dasarnya tidak dapat dikembalikan, kecuali terbukti rusak atau tidak sesuai pesanan.</li>
          <li>Pengembalian dana untuk pembayaran online diproses melalui Midtrans ke sumber dana semula, umumnya dalam 3–14 hari kerja tergantung penerbit.</li>
        </ul>
      </section>

      <section>
        <h2>8. Ketentuan bagi Mitra Toko</h2>
        <ul>
          <li>Data pengajuan yang disampaikan harus benar dan dapat diverifikasi.</li>
          <li>Mitra wajib menjaga mutu dan kelayakan sarana upacara yang dijual.</li>
          <li>Mitra bertanggung jawab atas ketepatan harga, stok, dan deskripsi produk.</li>
          <li>Kami dapat menghentikan kemitraan bila ditemukan pelanggaran yang merugikan Pengguna.</li>
        </ul>
      </section>

      <section>
        <h2>9. Asisten AI</h2>
        <p>
          Layanan menyediakan asisten berbasis kecerdasan buatan untuk membantu
          memperkirakan kebutuhan upacara dan mencari produk. Jawabannya bersifat{" "}
          <strong>bantuan umum, bukan ketetapan keagamaan</strong>.
        </p>
        <p>
          Tata cara upacara berbeda-beda menurut desa, kala, patra serta
          tradisi masing-masing keluarga. Untuk perkara yang menyangkut
          keabsahan ritual, mohon merujuk kepada pemangku, sulinggih, atau
          tetua adat setempat.
        </p>
      </section>

      <section>
        <h2>10. Larangan Penggunaan</h2>
        <p>Pengguna dilarang:</p>
        <ul>
          <li>membuat pesanan palsu atau menyalahgunakan identitas orang lain;</li>
          <li>mengganggu, meretas, atau membebani sistem secara tidak wajar;</li>
          <li>mengambil data Layanan secara otomatis tanpa izin tertulis;</li>
          <li>memakai Layanan untuk tujuan melanggar hukum yang berlaku di Indonesia.</li>
        </ul>
      </section>

      <section>
        <h2>11. Kekayaan Intelektual</h2>
        <p>
          Nama, logo, tata letak, tulisan, dan gambar pada Layanan dilindungi
          hukum dan tidak boleh dipakai untuk kepentingan komersial tanpa izin
          tertulis dari kami.
        </p>
      </section>

      <section>
        <h2>12. Batasan Tanggung Jawab</h2>
        <p>
          Layanan disediakan sebagaimana adanya. Sejauh diizinkan hukum, kami
          tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari
          keterlambatan pengiriman, gangguan jaringan, atau kekeliruan data yang
          bersumber dari Mitra Toko.
        </p>
        <p>
          Ketentuan ini tidak menghapus hak Anda sebagai konsumen menurut
          peraturan perundang-undangan yang berlaku.
        </p>
      </section>

      <section>
        <h2>13. Perubahan Ketentuan</h2>
        <p>
          Ketentuan ini dapat diperbarui sewaktu-waktu. Tanggal pembaruan
          tercantum di bagian atas halaman. Penggunaan Layanan setelah perubahan
          berarti Anda menyetujui ketentuan yang baru.
        </p>
      </section>

      <section>
        <h2>14. Hukum yang Berlaku</h2>
        <p>
          Ketentuan ini tunduk pada hukum Republik Indonesia. Perselisihan
          diupayakan diselesaikan secara musyawarah terlebih dahulu.
        </p>
      </section>

      <section>
        <h2>15. Hubungi Kami</h2>
        <ul>
          <li>
            WhatsApp:{" "}
            <a href={waLink()} target="_blank" rel="noopener noreferrer">
              {CS_WHATSAPP_DISPLAY}
            </a>
          </li>
          <li>
            Email: <a href={`mailto:${CS_EMAIL}`}>{CS_EMAIL}</a>
          </li>
        </ul>
        <p>
          Lihat juga{" "}
          <Link href="/kebijakan-privasi">Kebijakan Privasi</Link> kami.
        </p>
      </section>
    </LegalPage>
  );
}
