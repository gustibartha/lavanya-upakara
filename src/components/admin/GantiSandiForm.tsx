"use client";

import { useState } from "react";
import { PasswordInput } from "@/components/auth/PasswordInput";

export function GantiSandiForm() {
  const [lama, setLama] = useState("");
  const [baru, setBaru] = useState("");
  const [ulang, setUlang] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [berhasil, setBerhasil] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBerhasil(false);

    if (baru !== ulang) {
      setError("Konfirmasi kata sandi baru tidak sama.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sandi_lama: lama, sandi_baru: baru }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal mengganti kata sandi");
        return;
      }
      setBerhasil(true);
      setLama("");
      setBaru("");
      setUlang("");
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form-panel admin-sandi-form">
      <h2>Ganti Kata Sandi</h2>
      {error && <div className="admin-form-error">{error}</div>}
      {berhasil && (
        <div className="admin-form-success">
          ✅ Kata sandi berhasil diganti. Perangkat lain yang masih login sudah dikeluarkan.
        </div>
      )}

      <div className="admin-form-field">
        <label htmlFor="sandi-lama">Kata sandi saat ini</label>
        <PasswordInput
          id="sandi-lama"
          value={lama}
          onChange={(e) => setLama(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      <div className="admin-form-field">
        <label htmlFor="sandi-baru">Kata sandi baru (minimal 8 karakter)</label>
        <PasswordInput
          id="sandi-baru"
          value={baru}
          onChange={(e) => setBaru(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      <div className="admin-form-field">
        <label htmlFor="sandi-ulang">Ulangi kata sandi baru</label>
        <PasswordInput
          id="sandi-ulang"
          value={ulang}
          onChange={(e) => setUlang(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
        </button>
      </div>
    </form>
  );
}
