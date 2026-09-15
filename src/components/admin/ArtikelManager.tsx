"use client";

import { useState } from "react";

interface Artikel {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  konten: string[];
  kategori: string;
  gambar: string;
  aktif: boolean;
  created_at: string;
}

interface FormState {
  id: string | null; // null = mode tambah baru
  judul: string;
  ringkasan: string;
  konten: string; // paragraf dipisah baris kosong, dipecah saat disimpan
  kategori: string;
  gambar: string;
}

const FORM_KOSONG: FormState = {
  id: null,
  judul: "",
  ringkasan: "",
  konten: "",
  kategori: "",
  gambar: "",
};

// Gambar yang sudah ada di proyek ini dan cocok dipakai sebagai ilustrasi
// artikel — sama seperti yang dipakai kartu artikel contoh sebelumnya.
const GAMBAR_TERSEDIA = [
  "/images/categories/sesajen.png",
  "/images/categories/dupa-lilin.png",
  "/images/categories/taledan-buah.png",
  "/images/categories/dulang-bokor.png",
  "/images/categories/pakaian.png",
  "/images/products/sesajen-galungan.png",
  "/images/products/dupa-harum-pandan.png",
  "/images/products/banten-pejati.png",
  "/images/products/canang-sari-harian.png",
];

export function ArtikelManager({
  artikelAwal,
  daftarKategori,
}: {
  artikelAwal: Artikel[];
  daftarKategori: string[];
}) {
  const [daftarArtikel, setDaftarArtikel] = useState<Artikel[]>(artikelAwal);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const bukaForm = (artikel?: Artikel) => {
    setError(null);
    setForm(
      artikel
        ? {
            id: artikel.id,
            judul: artikel.judul,
            ringkasan: artikel.ringkasan,
            konten: artikel.konten.join("\n\n"),
            kategori: artikel.kategori,
            gambar: artikel.gambar,
          }
        : { ...FORM_KOSONG, kategori: daftarKategori[0] ?? "", gambar: GAMBAR_TERSEDIA[0] },
    );
  };

  const tutupForm = () => {
    setForm(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setError(null);

    // Baris kosong ganda memisahkan paragraf — pola menulis yang wajar
    // di textarea biasa, tidak perlu tombol tambah/hapus baris terpisah.
    const paragraf = form.konten
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const payload = {
      judul: form.judul,
      ringkasan: form.ringkasan,
      konten: paragraf,
      kategori: form.kategori,
      gambar: form.gambar,
    };

    try {
      const url = form.id ? `/api/admin/artikel/${form.id}` : "/api/admin/artikel";
      const method = form.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal menyimpan artikel");
        return;
      }

      if (form.id) {
        setDaftarArtikel((prev) =>
          prev.map((a) => (a.id === form.id ? { ...a, ...payload } : a)),
        );
      } else {
        setDaftarArtikel((prev) => [
          {
            id: data.id,
            slug: data.slug,
            ...payload,
            aktif: true,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      tutupForm();
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const toggleAktif = async (artikel: Artikel) => {
    setTogglingId(artikel.id);
    try {
      const res = await fetch(`/api/admin/artikel/${artikel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aktif: !artikel.aktif }),
      });
      if (res.ok) {
        setDaftarArtikel((prev) =>
          prev.map((a) => (a.id === artikel.id ? { ...a, aktif: !a.aktif } : a)),
        );
      }
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="admin-produk">
      <div className="admin-toolbar">
        <button type="button" className="btn-primary" onClick={() => bukaForm()}>
          + Tulis Artikel
        </button>
      </div>

      {form && (
        <form onSubmit={handleSubmit} className="admin-form-panel">
          <h2>{form.id ? "Edit Artikel" : "Tulis Artikel Baru"}</h2>
          {error && <div className="admin-form-error">{error}</div>}

          <div className="admin-form-grid">
            <div className="admin-form-field admin-form-field-full">
              <label>Judul</label>
              <input
                required
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
                placeholder="Cth: Memahami Makna Banten Pejati dalam Upacara"
              />
            </div>

            <div className="admin-form-field">
              <label>Kategori</label>
              <select
                required
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              >
                {daftarKategori.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-field">
              <label>Gambar</label>
              <select
                required
                value={form.gambar}
                onChange={(e) => setForm({ ...form, gambar: e.target.value })}
              >
                {GAMBAR_TERSEDIA.map((g) => (
                  <option key={g} value={g}>{g.split("/").pop()}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-field admin-form-field-full">
              <label>Ringkasan (tampil di kartu daftar artikel)</label>
              <textarea
                required
                rows={2}
                value={form.ringkasan}
                onChange={(e) => setForm({ ...form, ringkasan: e.target.value })}
                placeholder="Satu-dua kalimat yang menjelaskan isi artikel"
              />
            </div>

            <div className="admin-form-field admin-form-field-full">
              <label>Isi Artikel</label>
              <textarea
                required
                rows={10}
                value={form.konten}
                onChange={(e) => setForm({ ...form, konten: e.target.value })}
                placeholder={"Tulis paragraf pertama di sini.\n\nPisahkan paragraf berikutnya dengan baris kosong, seperti ini."}
              />
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Menyimpan..." : form.id ? "Simpan Perubahan" : "Terbitkan Artikel"}
            </button>
            <button type="button" className="btn-ghost" onClick={tutupForm}>
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {daftarArtikel.map((a) => (
              <tr key={a.id} className={a.aktif ? "" : "admin-row-nonaktif"}>
                <td>{a.judul}</td>
                <td>{a.kategori}</td>
                <td>
                  {new Date(a.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <span className={`admin-badge ${a.aktif ? "admin-badge-aktif" : "admin-badge-nonaktif"}`}>
                    {a.aktif ? "Terbit" : "Draf"}
                  </span>
                </td>
                <td className="admin-row-actions">
                  <button type="button" className="admin-link-btn" onClick={() => bukaForm(a)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-link-btn"
                    onClick={() => toggleAktif(a)}
                    disabled={togglingId === a.id}
                  >
                    {togglingId === a.id ? "..." : a.aktif ? "Jadikan Draf" : "Terbitkan"}
                  </button>
                </td>
              </tr>
            ))}
            {daftarArtikel.length === 0 && (
              <tr>
                <td colSpan={5} className="admin-table-empty">
                  Belum ada artikel. Klik &ldquo;Tulis Artikel&rdquo; untuk mulai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
