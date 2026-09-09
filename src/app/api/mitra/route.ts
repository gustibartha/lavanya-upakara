// POST /api/mitra — menyimpan pengajuan menjadi mitra toko

import db from "@/db";
import { partnerApplications } from "@/db/schema";
import { randomUUID } from "crypto";

interface PengajuanInput {
  nama_toko?: string;
  nama_pemilik?: string;
  whatsapp?: string;
  alamat?: string;
  kategori?: string[];
}

/** Batas panjang, supaya satu kiriman tidak bisa membanjiri tabel. */
const MAKS = {
  nama_toko: 120,
  nama_pemilik: 120,
  whatsapp: 25,
  alamat: 500,
};

/**
 * Menyeragamkan nomor WhatsApp ke format 62xxxx.
 * "08123…", "+62 812-3…", dan "62812…" semuanya jadi bentuk yang sama,
 * sehingga nomor yang sama tidak tersimpan dalam beberapa versi.
 */
function normalisasiWhatsapp(input: string) {
  const angka = input.replace(/\D/g, "");
  if (angka.startsWith("62")) return angka;
  if (angka.startsWith("0")) return `62${angka.slice(1)}`;
  if (angka.startsWith("8")) return `62${angka}`;
  return angka;
}

export async function POST(request: Request) {
  let body: PengajuanInput;
  try {
    body = (await request.json()) as PengajuanInput;
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const namaToko = body.nama_toko?.trim() ?? "";
  const namaPemilik = body.nama_pemilik?.trim() ?? "";
  const alamat = body.alamat?.trim() ?? "";
  const whatsappMentah = body.whatsapp?.trim() ?? "";
  const kategori = Array.isArray(body.kategori)
    ? body.kategori.map((k) => String(k).trim()).filter(Boolean).slice(0, 20)
    : [];

  // Divalidasi ulang di server — atribut `required` di formulir hanya
  // menghalangi pengisian lewat browser, bukan lewat permintaan langsung.
  if (!namaToko || !namaPemilik || !alamat || !whatsappMentah) {
    return Response.json(
      { error: "Nama toko, nama pemilik, nomor WhatsApp, dan alamat wajib diisi" },
      { status: 400 },
    );
  }
  if (kategori.length === 0) {
    return Response.json(
      { error: "Pilih minimal satu kategori produk" },
      { status: 400 },
    );
  }

  const whatsapp = normalisasiWhatsapp(whatsappMentah);
  if (whatsapp.length < 10 || whatsapp.length > 15) {
    return Response.json(
      { error: "Nomor WhatsApp tidak valid" },
      { status: 400 },
    );
  }

  if (
    namaToko.length > MAKS.nama_toko ||
    namaPemilik.length > MAKS.nama_pemilik ||
    alamat.length > MAKS.alamat ||
    whatsapp.length > MAKS.whatsapp
  ) {
    return Response.json({ error: "Isian terlalu panjang" }, { status: 400 });
  }

  try {
    const id = `mitra-${randomUUID().slice(0, 8)}`;
    await db.insert(partnerApplications).values({
      id,
      nama_toko: namaToko,
      nama_pemilik: namaPemilik,
      whatsapp,
      alamat,
      kategori: JSON.stringify(kategori),
      status: "baru",
    });

    return Response.json(
      { id, message: "Pengajuan tersimpan" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Partner application error:", error);
    return Response.json(
      { error: "Gagal menyimpan pengajuan" },
      { status: 500 },
    );
  }
}
