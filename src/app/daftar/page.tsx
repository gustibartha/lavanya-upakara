"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DaftarPage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDaftar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== konfirmasi) {
      setError("Password dan konfirmasi tidak sama");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: nama,
        email,
        password,
        // @ts-ignore
        phoneNumber: phone,
      });

      if (result.error) {
        setError(result.error.message || "Gagal mendaftar. Coba lagi.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <Link href="/" className="auth-logo">
            Lavanya<span>Upakara</span>
          </Link>
          <h1 className="auth-title">Buat Akun Baru</h1>
          <p className="auth-subtitle">
            Daftar untuk mulai belanja sarana sembahyang
          </p>
        </div>

        {/* Error */}
        {error && <div className="auth-error">⚠️ {error}</div>}

        {/* Form */}
        <form onSubmit={handleDaftar} className="auth-form">
          <div className="auth-field">
            <label htmlFor="nama" className="auth-label">
              Nama Lengkap
            </label>
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Ketut Suardana"
              className="auth-input"
              required
              autoComplete="name"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="auth-input"
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="phone" className="auth-label">
              Nomor WhatsApp
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812XXXXXXXX"
              className="auth-input"
              required
              autoComplete="tel"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="auth-input"
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="konfirmasi" className="auth-label">
              Konfirmasi Password
            </label>
            <input
              id="konfirmasi"
              type="password"
              value={konfirmasi}
              onChange={(e) => setKonfirmasi(e.target.value)}
              placeholder="Ulangi password"
              className="auth-input"
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-spinner">⏳</span>
            ) : (
              "Daftar Sekarang"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Sudah punya akun?{" "}
            <Link href="/masuk" className="auth-link">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* Decorative */}
      <div className="auth-decoration">
        <div className="auth-deco-emoji">🌺</div>
        <p className="auth-deco-text">
          Bergabung dengan <strong>30.000+</strong><br />
          pengguna di seluruh Bali
        </p>
      </div>
    </div>
  );
}
