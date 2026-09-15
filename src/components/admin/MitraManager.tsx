"use client";

import { Fragment, useState } from "react";

interface Pengajuan {
  id: string;
  nama_toko: string;
  nama_pemilik: string;
  whatsapp: string;
  alamat: string;
  kategori: string[];
  status: string;
  catatan_admin: string | null;
  created_at: string;
}

interface TokoForm {
  latitude: string;
  longitude: string;
  telepon: string;
  jam_buka: string;
  jam_tutup: string;
}

const TOKO_FORM_KOSONG: TokoForm = {
  latitude: "",
  longitude: "",
  telepon: "",
  jam_buka: "08:00",
  jam_tutup: "18:00",
};

const LABEL_STATUS: Record<string, string> = {
  baru: "Baru",
  dihubungi: "Dihubungi",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
};

function waLinkPengajuan(whatsapp: string) {
  return `https://wa.me/${whatsapp}`;
}

export function MitraManager({ pengajuanAwal }: { pengajuanAwal: Pengajuan[] }) {
  const [daftar, setDaftar] = useState<Pengajuan[]>(pengajuanAwal);
  const [dibukaId, setDibukaId] = useState<string | null>(null);
  const [catatan, setCatatan] = useState("");
  const [tokoForm, setTokoForm] = useState<TokoForm>(TOKO_FORM_KOSONG);
  const [tampilkanFormToko, setTampilkanFormToko] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bukaDetail = (p: Pengajuan) => {
    setError(null);
    setDibukaId(dibukaId === p.id ? null : p.id);
    setCatatan(p.catatan_admin ?? "");
    setTokoForm(TOKO_FORM_KOSONG);
    setTampilkanFormToko(false);
  };

  const simpanStatus = async (p: Pengajuan, status: string) => {
    setError(null);

    if (status === "disetujui" && tampilkanFormToko) {
      const lat = Number(tokoForm.latitude);
      const lng = Number(tokoForm.longitude);
      if (!tokoForm.latitude || !tokoForm.longitude || !Number.isFinite(lat) || !Number.isFinite(lng)) {
        setError("Latitude dan longitude toko wajib diisi dengan angka valid.");
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/mitra/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          catatan_admin: catatan,
          ...(status === "disetujui" && tampilkanFormToko
            ? {
                buat_toko: {
                  latitude: Number(tokoForm.latitude),
                  longitude: Number(tokoForm.longitude),
                  telepon: tokoForm.telepon || undefined,
                  jam_buka: tokoForm.jam_buka,
                  jam_tutup: tokoForm.jam_tutup,
                },
              }
            : {}),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal menyimpan perubahan");
        return;
      }

      setDaftar((prev) =>
        prev.map((item) =>
          item.id === p.id ? { ...item, status, catatan_admin: catatan || null } : item,
        ),
      );
      setDibukaId(null);
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-produk">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Toko</th>
              <th>Pemilik</th>
              <th>Kategori</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {daftar.map((p) => (
              <Fragment key={p.id}>
                <tr className={p.status === "ditolak" ? "admin-row-nonaktif" : ""}>
                  <td>{p.nama_toko}</td>
                  <td>{p.nama_pemilik}</td>
                  <td>{p.kategori.join(", ")}</td>
                  <td>
                    {new Date(p.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <span
                      className={`admin-badge ${
                        p.status === "disetujui"
                          ? "admin-badge-aktif"
                          : p.status === "ditolak"
                          ? "admin-badge-nonaktif"
                          : ""
                      }`}
                    >
                      {LABEL_STATUS[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="admin-row-actions">
                    <button type="button" className="admin-link-btn" onClick={() => bukaDetail(p)}>
                      {dibukaId === p.id ? "Tutup" : "Detail"}
                    </button>
                  </td>
                </tr>
                {dibukaId === p.id && (
                  <tr>
                    <td colSpan={6}>
                      <div className="admin-form-panel">
                        {error && <div className="admin-form-error">{error}</div>}

                        <div className="admin-form-grid">
                          <div className="admin-form-field">
                            <label>WhatsApp</label>
                            <a
                              href={waLinkPengajuan(p.whatsapp)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {p.whatsapp} ↗
                            </a>
                          </div>
                          <div className="admin-form-field admin-form-field-full">
                            <label>Alamat</label>
                            <p>{p.alamat}</p>
                          </div>
                          <div className="admin-form-field admin-form-field-full">
                            <label>Catatan Admin</label>
                            <textarea
                              rows={2}
                              value={catatan}
                              onChange={(e) => setCatatan(e.target.value)}
                              placeholder="Cth: Foto KTP & toko sudah dicek lewat WhatsApp, sesuai."
                            />
                          </div>
                        </div>

                        {p.status !== "disetujui" && (
                          <label className="admin-form-field" style={{ marginTop: "0.75rem" }}>
                            <input
                              type="checkbox"
                              checked={tampilkanFormToko}
                              onChange={(e) => setTampilkanFormToko(e.target.checked)}
                            />{" "}
                            Langsung buat entri toko saat disetujui
                          </label>
                        )}

                        {tampilkanFormToko && p.status !== "disetujui" && (
                          <div className="admin-form-grid" style={{ marginTop: "0.5rem" }}>
                            <div className="admin-form-field">
                              <label>Latitude</label>
                              <input
                                type="text"
                                value={tokoForm.latitude}
                                onChange={(e) => setTokoForm({ ...tokoForm, latitude: e.target.value })}
                                placeholder="Cth: -6.2088"
                              />
                            </div>
                            <div className="admin-form-field">
                              <label>Longitude</label>
                              <input
                                type="text"
                                value={tokoForm.longitude}
                                onChange={(e) => setTokoForm({ ...tokoForm, longitude: e.target.value })}
                                placeholder="Cth: 106.8456"
                              />
                            </div>
                            <div className="admin-form-field">
                              <label>Telepon (opsional)</label>
                              <input
                                type="text"
                                value={tokoForm.telepon}
                                onChange={(e) => setTokoForm({ ...tokoForm, telepon: e.target.value })}
                                placeholder={p.whatsapp}
                              />
                            </div>
                            <div className="admin-form-field">
                              <label>Jam Buka</label>
                              <input
                                type="text"
                                value={tokoForm.jam_buka}
                                onChange={(e) => setTokoForm({ ...tokoForm, jam_buka: e.target.value })}
                              />
                            </div>
                            <div className="admin-form-field">
                              <label>Jam Tutup</label>
                              <input
                                type="text"
                                value={tokoForm.jam_tutup}
                                onChange={(e) => setTokoForm({ ...tokoForm, jam_tutup: e.target.value })}
                              />
                            </div>
                          </div>
                        )}

                        <div className="admin-form-actions">
                          <button
                            type="button"
                            className="btn-primary"
                            disabled={saving}
                            onClick={() => simpanStatus(p, "disetujui")}
                          >
                            {saving ? "..." : "✓ Setujui"}
                          </button>
                          <button
                            type="button"
                            className="admin-link-btn"
                            disabled={saving}
                            onClick={() => simpanStatus(p, "dihubungi")}
                          >
                            Tandai Dihubungi
                          </button>
                          <button
                            type="button"
                            className="admin-link-btn"
                            disabled={saving}
                            onClick={() => simpanStatus(p, "ditolak")}
                          >
                            Tolak
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {daftar.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-table-empty">
                  Belum ada pengajuan mitra.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
