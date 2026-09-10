"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CS_WHATSAPP_DISPLAY, waLink } from "@/lib/kontak";

const KATEGORI = [
  "Banten & Sesajen",
  "Canang Sari",
  "Dupa & Lilin",
  "Dulang & Bokor",
  "Pakaian Adat",
  "Buah & Jajan",
];

const INPUT_CLASS =
  "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E58D35] focus:ring-1 focus:ring-[#E58D35] outline-none transition";

export default function MitraPage() {
  const [namaToko, setNamaToko] = useState("");
  const [namaPemilik, setNamaPemilik] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kategori, setKategori] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nomorPengajuan, setNomorPengajuan] = useState<string | null>(null);

  const toggleKategori = (nama: string) => {
    setKategori((prev) =>
      prev.includes(nama) ? prev.filter((k) => k !== nama) : [...prev, nama],
    );
  };

  /** Ringkasan pengajuan untuk dikirim ke CS lewat WhatsApp. */
  const pesanWhatsapp = (id: string) =>
    [
      "Halo Lavanya Upakara, saya ingin mendaftar sebagai mitra toko.",
      "",
      `No. Pengajuan: ${id}`,
      `Nama Toko: ${namaToko}`,
      `Nama Pemilik: ${namaPemilik}`,
      `WhatsApp: ${whatsapp}`,
      `Alamat: ${alamat}`,
      `Kategori: ${kategori.join(", ")}`,
      "",
      "Saya siap mengirimkan foto KTP dan foto depan toko untuk verifikasi.",
    ].join("\n");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (kategori.length === 0) {
      setError("Pilih minimal satu kategori produk.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mitra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_toko: namaToko,
          nama_pemilik: namaPemilik,
          whatsapp,
          alamat,
          kategori,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mengirim pengajuan. Coba lagi.");
        return;
      }
      // Layar sukses baru ditampilkan setelah server benar-benar menyimpan.
      setNomorPengajuan(data.id);
    } catch {
      setError("Koneksi bermasalah. Periksa jaringan lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FCFBFA] py-20 px-4 mt-16">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-10 anim-fadeup">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1C1917] font-display mb-4">
              Bergabung Menjadi <span className="text-[#B84A2A]">Mitra Lavanya</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Perluas jangkauan toko Anda ke ribuan umat di Jabodetabek. Daftarkan toko perlengkapan upacara Anda sekarang secara gratis!
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden anim-fadeup stagger-1">
            {nomorPengajuan ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-[#1C1917] font-display mb-3">
                  Pengajuan Tersimpan
                </h2>
                <p className="text-gray-600 mb-2 max-w-md mx-auto">
                  Nomor pengajuan Anda:{" "}
                  <strong className="text-[#B84A2A]">{nomorPengajuan}</strong>
                </p>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Satu langkah lagi — kirimkan data ini ke tim kami lewat WhatsApp
                  agar bisa segera diverifikasi. Pesannya sudah terisi otomatis,
                  Anda tinggal menekan kirim.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={waLink(pesanWhatsapp(nomorPengajuan))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-medium transition-all"
                  >
                    💬 Lanjutkan ke WhatsApp
                  </a>
                  <Link
                    href="/"
                    className="btn-ghost inline-flex items-center justify-center px-8 py-3 rounded-full font-medium border border-gray-200"
                  >
                    Kembali ke Beranda
                  </Link>
                </div>
                <p className="text-xs text-gray-500 mt-6">
                  Data Anda sudah tersimpan. Kalau tombol di atas tidak terbuka,
                  hubungi kami di {CS_WHATSAPP_DISPLAY} dan sebutkan nomor
                  pengajuan tersebut.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                {/* Section 1 */}
                <div>
                  <h3 className="text-xl font-display font-semibold text-[#1C1917] mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#E58D35] bg-opacity-20 text-[#D4790A] flex items-center justify-center text-sm">1</span>
                    Informasi Toko
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700" htmlFor="nama-toko">Nama Toko</label>
                      <input
                        id="nama-toko"
                        required
                        type="text"
                        className={INPUT_CLASS}
                        placeholder="Cth: Toko Merta Sari"
                        value={namaToko}
                        onChange={(e) => setNamaToko(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700" htmlFor="nama-pemilik">Nama Pemilik</label>
                      <input
                        id="nama-pemilik"
                        required
                        type="text"
                        className={INPUT_CLASS}
                        placeholder="Sesuai KTP"
                        value={namaPemilik}
                        onChange={(e) => setNamaPemilik(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700" htmlFor="wa">Nomor WhatsApp Aktif</label>
                      <input
                        id="wa"
                        required
                        type="tel"
                        className={INPUT_CLASS}
                        placeholder="Cth: 08123456789"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-100"></div>

                {/* Section 2 */}
                <div>
                  <h3 className="text-xl font-display font-semibold text-[#1C1917] mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#E58D35] bg-opacity-20 text-[#D4790A] flex items-center justify-center text-sm">2</span>
                    Lokasi &amp; Jualan
                  </h3>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700" htmlFor="alamat">Alamat Lengkap Toko</label>
                      <textarea
                        id="alamat"
                        required
                        className={`${INPUT_CLASS} h-24 resize-none`}
                        placeholder="Masukkan alamat lengkap beserta kelurahan/kecamatan..."
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Kategori Produk Utama (Pilih minimal 1)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {KATEGORI.map((cat) => (
                          <label
                            key={cat}
                            className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition ${
                              kategori.includes(cat)
                                ? "border-[#B84A2A] bg-[#B84A2A]/5"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-[#B84A2A] rounded border-gray-300 focus:ring-[#B84A2A]"
                              checked={kategori.includes(cat)}
                              onChange={() => toggleKategori(cat)}
                            />
                            <span className="text-sm text-gray-700">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-100"></div>

                {/* Section 3 — verifikasi lewat WhatsApp, bukan unggah di sini.
                    Sebelumnya bagian ini berupa kotak "Upload" yang tidak
                    berfungsi sama sekali. */}
                <div>
                  <h3 className="text-xl font-display font-semibold text-[#1C1917] mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#E58D35] bg-opacity-20 text-[#D4790A] flex items-center justify-center text-sm">3</span>
                    Dokumen Verifikasi
                  </h3>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                    <p className="text-sm text-gray-700 mb-2 font-semibold">
                      Foto KTP dan foto depan toko dikirim lewat WhatsApp
                    </p>
                    <p className="text-sm text-gray-600">
                      Setelah pengajuan tersimpan, Anda akan diarahkan ke WhatsApp
                      kami dengan data yang sudah terisi. Kirimkan kedua foto itu
                      pada percakapan yang sama agar verifikasi bisa langsung
                      diproses.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-4 rounded-xl text-lg font-semibold flex justify-center items-center gap-2 shadow-lg transition-transform hover:-translate-y-1 disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {loading ? "Menyimpan pengajuan..." : "🚀 Kirim Pengajuan Pendaftaran"}
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-4">
                    Dengan mendaftar, Anda menyetujui{" "}
                    <Link href="/syarat-ketentuan" className="underline">
                      Syarat &amp; Ketentuan
                    </Link>{" "}
                    dan{" "}
                    <Link href="/kebijakan-privasi" className="underline">
                      Kebijakan Privasi
                    </Link>{" "}
                    Lavanya Upakara.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
