"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function MitraPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FCFBFA] py-20 px-4 mt-16">
        <div className="container max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 anim-fadeup">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1C1917] font-display mb-4">
              Bergabung Menjadi <span className="text-[#B84A2A]">Mitra Lavanya</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Perluas jangkauan toko Anda ke ribuan umat di Bali. Daftarkan toko perlengkapan upacara Anda sekarang secara gratis!
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden anim-fadeup stagger-1">
            {isSubmitted ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-[#1C1917] font-display mb-3">Pendaftaran Berhasil Terkirim!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Terima kasih telah mendaftar. Tim kurasi Lavanya Upakara akan memverifikasi data Anda dan menghubungi Anda melalui WhatsApp dalam 1x24 jam kerja.
                </p>
                <Link href="/" className="btn-primary inline-flex items-center px-8 py-3 rounded-full font-medium transition-all">
                  Kembali ke Beranda
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                {/* Section 1: Info Toko */}
                <div>
                  <h3 className="text-xl font-display font-semibold text-[#1C1917] mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#E58D35] bg-opacity-20 text-[#D4790A] flex items-center justify-center text-sm">1</span>
                    Informasi Toko
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Nama Toko</label>
                      <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E58D35] focus:ring-1 focus:ring-[#E58D35] outline-none transition" placeholder="Cth: Toko Merta Sari" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Nama Pemilik</label>
                      <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E58D35] focus:ring-1 focus:ring-[#E58D35] outline-none transition" placeholder="Sesuai KTP" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700">Nomor WhatsApp Aktif</label>
                      <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E58D35] focus:ring-1 focus:ring-[#E58D35] outline-none transition" placeholder="Cth: 08123456789" />
                    </div>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-100"></div>

                {/* Section 2: Lokasi & Kategori */}
                <div>
                  <h3 className="text-xl font-display font-semibold text-[#1C1917] mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#E58D35] bg-opacity-20 text-[#D4790A] flex items-center justify-center text-sm">2</span>
                    Lokasi & Jualan
                  </h3>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Alamat Lengkap Toko</label>
                      <textarea required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E58D35] focus:ring-1 focus:ring-[#E58D35] outline-none transition h-24 resize-none" placeholder="Masukkan alamat lengkap beserta banjar/desa..."></textarea>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Kategori Produk Utama (Pilih minimal 1)</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['Banten & Sesajen', 'Canang Sari', 'Dupa & Lilin', 'Dulang & Bokor', 'Pakaian Adat', 'Buah & Jajan'].map((cat) => (
                          <label key={cat} className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                            <input type="checkbox" className="w-4 h-4 text-[#B84A2A] rounded border-gray-300 focus:ring-[#B84A2A]" />
                            <span className="text-sm text-gray-700">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-100"></div>

                {/* Section 3: Verifikasi */}
                <div>
                  <h3 className="text-xl font-display font-semibold text-[#1C1917] mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#E58D35] bg-opacity-20 text-[#D4790A] flex items-center justify-center text-sm">3</span>
                    Dokumen Verifikasi
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer">
                      <div className="text-3xl mb-2">📸</div>
                      <p className="text-sm font-semibold text-gray-700">Upload Foto KTP</p>
                      <p className="text-xs text-gray-500 mt-1">JPG/PNG, Max 2MB</p>
                    </div>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer">
                      <div className="text-3xl mb-2">🏪</div>
                      <p className="text-sm font-semibold text-gray-700">Upload Foto Depan Toko</p>
                      <p className="text-xs text-gray-500 mt-1">JPG/PNG, Max 2MB</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button type="submit" className="w-full btn-primary py-4 rounded-xl text-lg font-semibold flex justify-center items-center gap-2 shadow-lg transition-transform hover:-translate-y-1">
                    🚀 Kirim Pengajuan Pendaftaran
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-4">
                    Dengan mendaftar, Anda menyetujui Syarat dan Ketentuan layanan Lavanya Upakara.
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
