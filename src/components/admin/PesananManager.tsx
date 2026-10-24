"use client";

import { Fragment, useMemo, useState } from "react";
import { formatRupiah } from "@/lib/data";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  STATUS_BERIKUTNYA,
  labelMetodeBayar,
  nomorPesanan,
} from "@/lib/order-status";

export interface PesananAdmin {
  id: string;
  created_at: string;
  status: string;
  status_bayar: string;
  metode_bayar: string;
  payment_type: string | null;
  total_harga: number;
  shipping_method: string | null;
  shipping_service: string | null;
  jalan: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  kota: string | null;
  provinsi: string | null;
  kodepos: string | null;
  catatan: string | null;
  lokasi_lat: number | null;
  lokasi_lng: number | null;
  ongkir: number | null;
  tracking_url: string | null;
  toko: { nama: string; alamat: string; telepon: string | null; lat: number; lng: number } | null;
  pembeli: { nama: string; email: string; telepon: string | null } | null;
  items: { nama: string; jumlah: number; harga: number }[];
}

const FILTER = [
  { key: "aktif", label: "Perlu Tindakan", cocok: (s: string) => ["menunggu", "diproses", "dikirim"].includes(s) },
  { key: "selesai", label: "Selesai", cocok: (s: string) => s === "selesai" },
  { key: "dibatalkan", label: "Dibatalkan", cocok: (s: string) => s === "dibatalkan" },
  { key: "semua", label: "Semua", cocok: () => true },
] as const;

const LABEL_AKSI: Record<string, string> = {
  diproses: "✓ Konfirmasi & Proses",
  dikirim: "🛵 Tandai Dikirim",
  selesai: "✅ Tandai Selesai",
};

const NAMA_KURIR: Record<string, string> = {
  gojek: "GoSend (Gojek)",
  grab: "GrabExpress",
  paxel: "Paxel",
};

/** Nomor lokal 08xx / +62 8xx → 628xx untuk link wa.me. */
function nomorWa(telepon: string | null | undefined) {
  if (!telepon) return null;
  const angka = telepon.replace(/\D/g, "");
  if (!angka) return null;
  if (angka.startsWith("62")) return angka;
  if (angka.startsWith("0")) return `62${angka.slice(1)}`;
  return `62${angka}`;
}

function linkWa(telepon: string | null | undefined, pesan: string) {
  const nomor = nomorWa(telepon);
  return nomor ? `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}` : null;
}

function alamatLengkap(p: PesananAdmin) {
  return [p.jalan, p.kelurahan, p.kecamatan, p.kota, p.provinsi, p.kodepos].filter(Boolean).join(", ");
}

export function PesananManager({ pesananAwal }: { pesananAwal: PesananAdmin[] }) {
  const [daftar, setDaftar] = useState(pesananAwal);
  const [filter, setFilter] = useState<(typeof FILTER)[number]["key"]>("aktif");
  const [dibukaId, setDibukaId] = useState<string | null>(null);
  const [ongkir, setOngkir] = useState("");
  const [tracking, setTracking] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tersalin, setTersalin] = useState(false);

  const tampil = useMemo(() => {
    const f = FILTER.find((x) => x.key === filter)!;
    return daftar.filter((p) => f.cocok(p.status));
  }, [daftar, filter]);

  const jumlahAktif = daftar.filter((p) => FILTER[0].cocok(p.status)).length;

  const bukaDetail = (p: PesananAdmin) => {
    setError(null);
    setTersalin(false);
    if (dibukaId === p.id) {
      setDibukaId(null);
      return;
    }
    setDibukaId(p.id);
    setOngkir(p.ongkir != null ? String(p.ongkir) : "");
    setTracking(p.tracking_url ?? "");
  };

  const simpan = async (p: PesananAdmin, status?: string) => {
    setError(null);
    if (status === "dibatalkan") {
      const peringatan =
        p.status_bayar === "dibayar"
          ? "Pesanan ini SUDAH DIBAYAR online. Membatalkan tidak otomatis mengembalikan dana — refund harus diproses manual di dashboard Midtrans. Lanjutkan?"
          : "Batalkan pesanan ini? Status tidak bisa diubah lagi setelahnya.";
      if (!window.confirm(peringatan)) return;
    }
    if (status === "dikirim" && p.shipping_method === "delivery" && !tracking.trim()) {
      if (!window.confirm("Link pelacakan kurir belum diisi — pembeli tidak bisa memantau pengiriman. Tetap tandai dikirim?")) return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pesanan/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(status ? { status } : {}),
          ongkir: ongkir.trim() === "" ? null : Number(ongkir.replace(/\D/g, "")),
          tracking_url: tracking,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan");
        return;
      }
      setDaftar((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, ...data.perubahan } : x)),
      );
      if (status) setDibukaId(null);
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const salinKoordinat = (p: PesananAdmin) => {
    if (p.lokasi_lat == null || p.lokasi_lng == null) return;
    navigator.clipboard.writeText(`${p.lokasi_lat},${p.lokasi_lng}`).then(() => {
      setTersalin(true);
      window.setTimeout(() => setTersalin(false), 2000);
    });
  };

  return (
    <div className="admin-produk">
      <div className="admin-pesanan-tabs">
        {FILTER.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`admin-pesanan-tab ${filter === f.key ? "active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            {f.key === "aktif" && jumlahAktif > 0 && <span className="admin-pesanan-count">{jumlahAktif}</span>}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pesanan</th>
              <th>Pembeli</th>
              <th>Toko</th>
              <th>Total</th>
              <th>Pengiriman</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tampil.map((p) => {
              const belumLunasOnline = p.metode_bayar === "midtrans" && p.status_bayar !== "dibayar";
              const berikut = STATUS_BERIKUTNYA[p.status];
              const delivery = p.shipping_method === "delivery";
              const pesanPembeli = `Om Swastyastu 🙏 Kami dari Lavanya Upakara, terkait pesanan #${nomorPesanan(p.id)}${
                delivery
                  ? ` dengan pengiriman ${NAMA_KURIR[p.shipping_service ?? ""] ?? "kurir"}${
                      p.ongkir != null ? `. Ongkir ke alamat Anda ${formatRupiah(p.ongkir)}` : ""
                    }.`
                  : " (ambil di toko)."
              }`;
              const pesanToko = `Om Swastyastu 🙏 Ada pesanan Lavanya Upakara #${nomorPesanan(p.id)}:\n${p.items
                .map((i) => `- ${i.jumlah}x ${i.nama}`)
                .join("\n")}\n${delivery ? "Kurir akan menjemput ke toko." : "Pembeli akan mengambil di toko."}`;
              const waPembeli = linkWa(p.pembeli?.telepon, pesanPembeli);
              const waToko = linkWa(p.toko?.telepon, pesanToko);

              return (
                <Fragment key={p.id}>
                  <tr className={p.status === "dibatalkan" ? "admin-row-nonaktif" : ""}>
                    <td>
                      <strong>#{nomorPesanan(p.id)}</strong>
                      <div className="admin-cell-sub">
                        {new Date(p.created_at).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td>{p.pembeli?.nama ?? "—"}</td>
                    <td>{p.toko?.nama ?? "—"}</td>
                    <td>
                      {formatRupiah(p.total_harga)}
                      <div className={`admin-cell-sub ${belumLunasOnline ? "admin-text-warn" : ""}`}>
                        {labelMetodeBayar(p.metode_bayar, p.payment_type)} ·{" "}
                        {PAYMENT_STATUS[p.status_bayar]?.label ?? p.status_bayar}
                      </div>
                    </td>
                    <td>
                      {delivery ? `🛵 ${NAMA_KURIR[p.shipping_service ?? ""] ?? "Kurir"}` : "🏪 Ambil di toko"}
                    </td>
                    <td>
                      <span className={`admin-badge admin-badge-status-${p.status}`}>
                        {ORDER_STATUS[p.status]?.label ?? p.status}
                      </span>
                    </td>
                    <td className="admin-row-actions">
                      <button type="button" className="admin-link-btn" onClick={() => bukaDetail(p)}>
                        {dibukaId === p.id ? "Tutup" : "Kelola"}
                      </button>
                    </td>
                  </tr>

                  {dibukaId === p.id && (
                    <tr>
                      <td colSpan={7}>
                        <div className="admin-form-panel admin-pesanan-detail">
                          {error && <div className="admin-form-error">{error}</div>}

                          <div className="admin-pesanan-grid">
                            <section>
                              <h3>Isi Pesanan</h3>
                              <ul className="admin-pesanan-items">
                                {p.items.map((i, idx) => (
                                  <li key={idx}>
                                    <span>{i.jumlah}× {i.nama}</span>
                                    <span>{formatRupiah(i.jumlah * i.harga)}</span>
                                  </li>
                                ))}
                                <li className="admin-pesanan-total">
                                  <span>Total barang</span>
                                  <span>{formatRupiah(p.total_harga)}</span>
                                </li>
                              </ul>
                              {p.catatan && <p className="admin-pesanan-note">📝 {p.catatan}</p>}
                            </section>

                            <section>
                              <h3>Pembeli</h3>
                              <p>
                                <strong>{p.pembeli?.nama ?? "—"}</strong>
                                <br />
                                {p.pembeli?.email}
                                {p.pembeli?.telepon && <><br />📱 {p.pembeli.telepon}</>}
                              </p>
                              {waPembeli ? (
                                <a href={waPembeli} target="_blank" rel="noopener noreferrer" className="admin-wa-btn">
                                  💬 WhatsApp Pembeli
                                </a>
                              ) : (
                                <p className="admin-cell-sub">Pembeli belum mencantumkan nomor WhatsApp — hubungi lewat email.</p>
                              )}

                              <h3>Toko</h3>
                              <p>
                                <strong>{p.toko?.nama}</strong>
                                <br />
                                {p.toko?.alamat}
                              </p>
                              {waToko && (
                                <a href={waToko} target="_blank" rel="noopener noreferrer" className="admin-wa-btn">
                                  💬 WhatsApp Toko
                                </a>
                              )}
                            </section>

                            {delivery && (
                              <section>
                                <h3>Alamat Antar</h3>
                                <p>{alamatLengkap(p) || "—"}</p>
                                {p.lokasi_lat != null && p.lokasi_lng != null ? (
                                  <div className="admin-pesanan-links">
                                    <a
                                      href={`https://www.google.com/maps?q=${p.lokasi_lat},${p.lokasi_lng}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      📍 Buka titik antar di Google Maps
                                    </a>
                                    {p.toko && (
                                      <a
                                        href={`https://www.google.com/maps/dir/?api=1&origin=${p.toko.lat},${p.toko.lng}&destination=${p.lokasi_lat},${p.lokasi_lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        🧭 Lihat rute toko → pembeli
                                      </a>
                                    )}
                                    <button type="button" className="admin-link-btn" onClick={() => salinKoordinat(p)}>
                                      {tersalin ? "✓ Koordinat tersalin" : "📋 Salin koordinat"}
                                    </button>
                                  </div>
                                ) : (
                                  <p className="admin-cell-sub">Pesanan lama — titik peta belum ada, pakai alamat tertulis.</p>
                                )}

                                <h3>Kurir</h3>
                                <div className="admin-form-grid admin-pesanan-form">
                                  <div className="admin-form-field">
                                    <label>Ongkir (Rp)</label>
                                    <input
                                      inputMode="numeric"
                                      value={ongkir}
                                      onChange={(e) => setOngkir(e.target.value.replace(/\D/g, ""))}
                                      placeholder="Cth: 18000"
                                    />
                                  </div>
                                  <div className="admin-form-field">
                                    <label>Link pelacakan dari aplikasi Gojek/Grab</label>
                                    <input
                                      value={tracking}
                                      onChange={(e) => setTracking(e.target.value)}
                                      placeholder="https://..."
                                    />
                                  </div>
                                </div>
                              </section>
                            )}
                          </div>

                          {belumLunasOnline && p.status === "menunggu" && (
                            <p className="admin-form-note">
                              ⏳ Pesanan ini dibayar online dan belum lunas. Tombol proses aktif setelah
                              pembayaran masuk.
                            </p>
                          )}

                          <div className="admin-form-actions">
                            {berikut && (
                              <button
                                type="button"
                                className="btn-primary"
                                disabled={saving || (belumLunasOnline && berikut !== "dibatalkan")}
                                onClick={() => simpan(p, berikut)}
                              >
                                {saving ? "Menyimpan..." : LABEL_AKSI[berikut]}
                              </button>
                            )}
                            {delivery && (
                              <button type="button" className="btn-ghost" disabled={saving} onClick={() => simpan(p)}>
                                Simpan Ongkir & Link
                              </button>
                            )}
                            {berikut && (
                              <button
                                type="button"
                                className="admin-link-btn admin-text-danger"
                                disabled={saving}
                                onClick={() => simpan(p, "dibatalkan")}
                              >
                                Batalkan Pesanan
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {tampil.length === 0 && (
              <tr>
                <td colSpan={7} className="admin-table-empty">
                  {filter === "aktif" ? "Tidak ada pesanan yang perlu ditindaklanjuti. 🙏" : "Belum ada pesanan."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
