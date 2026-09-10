import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { CS_EMAIL, CS_WHATSAPP_DISPLAY, waLink } from "@/lib/kontak";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — Lavanya Upakara",
  description:
    "Data apa yang kami kumpulkan, untuk apa dipakai, kepada siapa dibagikan, dan hak Anda atas data pribadi di Lavanya Upakara.",
};

export default function KebijakanPrivasiPage() {
  return (
    <LegalPage
      judul="Kebijakan Privasi"
      ringkasan="Penjelasan mengenai data yang kami kumpulkan, alasan pengumpulannya, pihak yang menerimanya, dan hak Anda atas data tersebut."
      terakhirDiperbarui="9 September 2026"
    >
      <section>
        <h2>1. Data yang Kami Kumpulkan</h2>

        <h3>a. Data akun</h3>
        <p>Nama, alamat email, nomor WhatsApp, dan kata sandi. Kata sandi disimpan dalam bentuk teracak (hash), bukan teks asli, sehingga tidak dapat kami baca.</p>

        <h3>b. Data pesanan</h3>
        <p>Alamat pengantaran (jalan, kelurahan, kecamatan, kota, provinsi, kode pos), catatan pesanan, daftar barang, metode pengiriman, dan status pembayaran.</p>

        <h3>c. Data lokasi</h3>
        <p>
          Pada halaman Toko Terdekat, browser Anda dapat meminta izin mengakses
          lokasi. Koordinat itu dipakai <strong>hanya</strong> untuk menghitung
          jarak ke toko dan tidak kami simpan sebagai riwayat. Izin ini dapat
          Anda tolak, dan halaman tetap dapat digunakan.
        </p>

        <h3>d. Data teknis</h3>
        <p>
          Saat Anda masuk, sistem mencatat alamat IP dan jenis peramban
          (user agent) pada data sesi. Ini dipakai untuk keamanan akun dan
          mendeteksi penggunaan yang mencurigakan.
        </p>

        <h3>e. Data pengajuan mitra</h3>
        <p>Bagi yang mendaftar sebagai Mitra Toko: nama toko, nama pemilik, nomor WhatsApp, alamat toko, dan kategori produk.</p>

        <h3>f. Percakapan dengan Asisten AI</h3>
        <p>Pesan yang Anda ketik pada fitur asisten dikirim ke penyedia model bahasa untuk memperoleh jawaban.</p>
      </section>

      <section>
        <h2>2. Untuk Apa Data Dipakai</h2>
        <ul>
          <li>membuat dan mengelola akun Anda;</li>
          <li>memproses, mengantar, dan memantau pesanan;</li>
          <li>menampilkan toko terdekat dari posisi Anda;</li>
          <li>memproses pembayaran dan mencatat pelunasannya;</li>
          <li>menghubungi Anda mengenai pesanan atau pengajuan kemitraan;</li>
          <li>menjaga keamanan akun dan mencegah penyalahgunaan.</li>
        </ul>
        <p>
          Kami <strong>tidak menjual</strong> data pribadi Anda kepada pihak
          mana pun.
        </p>
      </section>

      <section>
        <h2>3. Pihak Ketiga yang Menerima Data</h2>
        <p>Layanan ini berjalan dengan bantuan penyedia berikut, sebatas keperluannya:</p>
        <ul>
          <li><strong>Midtrans</strong> — memproses pembayaran online. Data kartu dan kredensial perbankan diproses langsung oleh Midtrans dan tidak melewati server kami.</li>
          <li><strong>Supabase</strong> — penyimpanan basis data akun dan pesanan.</li>
          <li><strong>Vercel</strong> — tempat situs ini dijalankan.</li>
          <li><strong>Google (Gemini)</strong> — menghasilkan jawaban Asisten AI dari pesan yang Anda kirim.</li>
          <li><strong>Google Maps dan OpenStreetMap</strong> — menampilkan peta lokasi toko.</li>
          <li><strong>Mitra Toko dan kurir</strong> — menerima nama, nomor WhatsApp, dan alamat sebatas yang diperlukan untuk menyiapkan serta mengantar pesanan Anda.</li>
        </ul>
        <p>
          Data juga dapat kami sampaikan bila diwajibkan oleh peraturan
          perundang-undangan atau permintaan resmi aparat yang berwenang.
        </p>
      </section>

      <section>
        <h2>4. Penyimpanan di Perangkat Anda</h2>
        <ul>
          <li><strong>Cookie sesi</strong> — menjaga Anda tetap masuk setelah login.</li>
          <li><strong>Penyimpanan lokal (localStorage)</strong> — menyimpan isi keranjang dan daftar produk favorit. Data ini berada di peramban Anda sendiri, tidak dikirim ke server kami, dan hilang bila Anda membersihkan data situs.</li>
        </ul>
      </section>

      <section>
        <h2>5. Keamanan</h2>
        <p>
          Seluruh lalu lintas situs berjalan melalui koneksi terenkripsi
          (HTTPS). Kata sandi disimpan teracak. Akses ke data pesanan dibatasi
          pada pemilik akun yang bersangkutan.
        </p>
        <p>
          Meski demikian, tidak ada sistem yang sepenuhnya kebal. Gunakan kata
          sandi yang tidak Anda pakai di layanan lain, dan segera beri tahu kami
          bila ada kejanggalan pada akun Anda.
        </p>
      </section>

      <section>
        <h2>6. Berapa Lama Data Disimpan</h2>
        <ul>
          <li>Data akun disimpan selama akun masih aktif.</li>
          <li>Data pesanan disimpan sebagai catatan transaksi dan keperluan pembukuan.</li>
          <li>Data pengajuan mitra disimpan selama proses verifikasi dan masa kemitraan.</li>
        </ul>
        <p>Anda dapat meminta penghapusan data yang tidak lagi diwajibkan disimpan oleh peraturan.</p>
      </section>

      <section>
        <h2>7. Hak Anda</h2>
        <p>
          Sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data
          Pribadi, Anda berhak untuk:
        </p>
        <ul>
          <li>mengetahui data apa yang kami simpan tentang Anda;</li>
          <li>memperbaiki data yang keliru;</li>
          <li>meminta penghapusan data;</li>
          <li>menarik persetujuan atas pemrosesan data tertentu;</li>
          <li>mengajukan keberatan atas cara data Anda diproses.</li>
        </ul>
        <p>
          Permintaan dapat disampaikan melalui kontak di bagian bawah halaman
          ini. Kami akan menanggapinya dalam waktu yang wajar setelah memastikan
          identitas pemohon.
        </p>
      </section>

      <section>
        <h2>8. Anak di Bawah Umur</h2>
        <p>
          Layanan ini ditujukan bagi pengguna berusia 17 tahun ke atas atau yang
          sudah memiliki identitas resmi. Anak di bawah umur sebaiknya memakai
          Layanan dengan pendampingan orang tua atau wali.
        </p>
      </section>

      <section>
        <h2>9. Perubahan Kebijakan</h2>
        <p>
          Kebijakan ini dapat diperbarui bila layanan berkembang atau peraturan
          berubah. Tanggal pembaruan tercantum di bagian atas halaman.
        </p>
      </section>

      <section>
        <h2>10. Hubungi Kami</h2>
        <p>Untuk pertanyaan atau permintaan terkait data pribadi:</p>
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
          <Link href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link> kami.
        </p>
      </section>
    </LegalPage>
  );
}
