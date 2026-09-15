"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/data";

interface Toko {
  id: string;
  nama_toko: string;
}

interface Kategori {
  slug: string;
  nama: string;
}

interface Produk {
  id: string;
  slug: string;
  nama_produk: string;
  store_id: string;
  kategori: string;
  kategori_slug: string;
  harga: number;
  deskripsi: string;
  emoji: string;
  bg_color: string;
  populer: boolean | null;
  stok: number | null;
  aktif: boolean;
  store: Toko | null;
}

interface FormState {
  id: string | null; // null = mode tambah baru
  nama_produk: string;
  store_id: string;
  kategori_slug: string;
  harga: string;
  deskripsi: string;
  emoji: string;
  stok: string;
  populer: boolean;
}

const FORM_KOSONG: FormState = {
  id: null,
  nama_produk: "",
  store_id: "",
  kategori_slug: "",
  harga: "",
  deskripsi: "",
  emoji: "📦",
  stok: "100",
  populer: false,
};

export function ProdukManager({
  produkAwal,
  daftarToko,
  daftarKategori,
}: {
  produkAwal: Produk[];
  daftarToko: Toko[];
  daftarKategori: Kategori[];
}) {
  const [daftarProduk, setDaftarProduk] = useState<Produk[]>(produkAwal);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const bukaForm = (produk?: Produk) => {
    setError(null);
    setForm(
      produk
        ? {
            id: produk.id,
            nama_produk: produk.nama_produk,
            store_id: produk.store_id,
            kategori_slug: produk.kategori_slug,
            harga: String(produk.harga),
            deskripsi: produk.deskripsi,
            emoji: produk.emoji,
            stok: String(produk.stok ?? 0),
            populer: Boolean(produk.populer),
          }
        : { ...FORM_KOSONG, store_id: daftarToko[0]?.id ?? "", kategori_slug: daftarKategori[0]?.slug ?? "" },
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

    const payload = {
      nama_produk: form.nama_produk,
      store_id: form.store_id,
      kategori_slug: form.kategori_slug,
      harga: Number(form.harga),
      deskripsi: form.deskripsi,
      emoji: form.emoji,
      stok: Number(form.stok),
      populer: form.populer,
    };

    try {
      const url = form.id ? `/api/admin/produk/${form.id}` : "/api/admin/produk";
      const method = form.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal menyimpan produk");
        return;
      }

      // Ambil ulang seluruh daftar dari sumbernya, bukan menyusun sendiri
      // hasil gabungan di sisi klien — lebih sederhana dan tidak mungkin
      // meleset dari kondisi database yang sebenarnya (mis. nama toko yang
      // ikut berubah kalau relasinya berubah).
      const segar = await fetch("/api/products").then((r) => r.json());
      const petaToko = new Map(daftarToko.map((t) => [t.id, t]));
      setDaftarProduk(
        (segar.products ?? []).map((p: Produk & { store_id: string }) => ({
          ...p,
          store: petaToko.get(p.store_id) ?? null,
        })),
      );

      tutupForm();
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const toggleAktif = async (produk: Produk) => {
    setTogglingId(produk.id);
    try {
      const res = await fetch(`/api/admin/produk/${produk.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aktif: !produk.aktif }),
      });
      if (res.ok) {
        setDaftarProduk((prev) =>
          prev.map((p) => (p.id === produk.id ? { ...p, aktif: !p.aktif } : p)),
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
          + Tambah Produk
        </button>
      </div>

      {form && (
        <form onSubmit={handleSubmit} className="admin-form-panel">
          <h2>{form.id ? "Edit Produk" : "Tambah Produk Baru"}</h2>
          {error && <div className="admin-form-error">{error}</div>}

          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label>Nama Produk</label>
              <input
                required
                value={form.nama_produk}
                onChange={(e) => setForm({ ...form, nama_produk: e.target.value })}
                placeholder="Cth: Canang Sari Segar"
              />
            </div>

            <div className="admin-form-field">
              <label>Toko</label>
              <select
                required
                value={form.store_id}
                onChange={(e) => setForm({ ...form, store_id: e.target.value })}
              >
                {daftarToko.map((t) => (
                  <option key={t.id} value={t.id}>{t.nama_toko}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-field">
              <label>Kategori</label>
              <select
                required
                value={form.kategori_slug}
                onChange={(e) => setForm({ ...form, kategori_slug: e.target.value })}
              >
                {daftarKategori.map((k) => (
                  <option key={k.slug} value={k.slug}>{k.nama}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-field">
              <label>Harga (Rp)</label>
              <input
                required
                type="number"
                min={1}
                value={form.harga}
                onChange={(e) => setForm({ ...form, harga: e.target.value })}
                placeholder="15000"
              />
            </div>

            <div className="admin-form-field">
              <label>Stok</label>
              <input
                type="number"
                min={0}
                value={form.stok}
                onChange={(e) => setForm({ ...form, stok: e.target.value })}
              />
            </div>

            <div className="admin-form-field">
              <label>Emoji Ikon</label>
              <input
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                placeholder="📦"
                maxLength={4}
              />
            </div>

            <div className="admin-form-field admin-form-field-full">
              <label>Deskripsi</label>
              <textarea
                required
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                rows={3}
              />
            </div>

            <label className="admin-form-checkbox">
              <input
                type="checkbox"
                checked={form.populer}
                onChange={(e) => setForm({ ...form, populer: e.target.checked })}
              />
              Tandai sebagai produk populer
            </label>
          </div>

          {/* Belum ada unggah gambar sungguhan — produk baru memakai emoji
              sebagai ikon di katalog sampai fitur foto/gambar dibangun. */}
          <p className="admin-form-note">
            📸 Unggah foto produk belum tersedia. Produk baru memakai emoji
            di atas sebagai ikon sementara di katalog.
          </p>

          <div className="admin-form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Menyimpan..." : form.id ? "Simpan Perubahan" : "Tambah Produk"}
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
              <th>Produk</th>
              <th>Toko</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {daftarProduk.map((p) => (
              <tr key={p.id} className={p.aktif ? "" : "admin-row-nonaktif"}>
                <td>
                  <span className="admin-produk-emoji">{p.emoji}</span> {p.nama_produk}
                </td>
                <td>{p.store?.nama_toko ?? "—"}</td>
                <td>{p.kategori}</td>
                <td>{formatRupiah(p.harga)}</td>
                <td>{p.stok ?? 0}</td>
                <td>
                  <span className={`admin-badge ${p.aktif ? "admin-badge-aktif" : "admin-badge-nonaktif"}`}>
                    {p.aktif ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="admin-row-actions">
                  <button type="button" className="admin-link-btn" onClick={() => bukaForm(p)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-link-btn"
                    onClick={() => toggleAktif(p)}
                    disabled={togglingId === p.id}
                  >
                    {togglingId === p.id ? "..." : p.aktif ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </td>
              </tr>
            ))}
            {daftarProduk.length === 0 && (
              <tr>
                <td colSpan={7} className="admin-table-empty">
                  Belum ada produk. Klik &ldquo;Tambah Produk&rdquo; untuk mulai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
