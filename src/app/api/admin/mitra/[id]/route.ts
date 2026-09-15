// PUT /api/admin/mitra/[id] — mengubah status pengajuan mitra, dan kalau
// disetujui sekaligus membuat entri toko baru di tabel `stores`.

import { db } from "@/db";
import { partnerApplications, stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminApi } from "@/lib/admin/guard";
import { randomUUID } from "crypto";

const STATUS_VALID = ["baru", "dihubungi", "disetujui", "ditolak"];

interface ToggleInput {
  status?: string;
  catatan_admin?: string;
  buat_toko?: {
    latitude?: number;
    longitude?: number;
    emoji?: string;
    telepon?: string;
    jam_buka?: string;
    jam_tutup?: string;
  };
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdminApi();
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: ToggleInput;
  try {
    body = (await request.json()) as ToggleInput;
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const pengajuan = await db.query.partnerApplications.findFirst({
    where: eq(partnerApplications.id, id),
  });
  if (!pengajuan) {
    return Response.json({ error: "Pengajuan tidak ditemukan" }, { status: 404 });
  }

  const status = body.status?.trim();
  if (!status || !STATUS_VALID.includes(status)) {
    return Response.json({ error: "Status tidak valid" }, { status: 400 });
  }

  // Toko hanya dibuat sekali — pengajuan yang sudah disetujui sebelumnya
  // tidak boleh membuat entri toko duplikat kalau statusnya disimpan ulang.
  if (status === "disetujui" && body.buat_toko && pengajuan.status !== "disetujui") {
    const lat = Number(body.buat_toko.latitude);
    const lng = Number(body.buat_toko.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return Response.json(
        { error: "Latitude dan longitude toko wajib diisi dengan angka valid" },
        { status: 400 },
      );
    }

    try {
      await db.insert(stores).values({
        id: `store-${randomUUID().slice(0, 8)}`,
        nama_toko: pengajuan.nama_toko,
        alamat: pengajuan.alamat,
        latitude: lat,
        longitude: lng,
        kategori: pengajuan.kategori,
        emoji: body.buat_toko.emoji?.trim() || "🏪",
        telepon: body.buat_toko.telepon?.trim() || pengajuan.whatsapp,
        jam_buka: body.buat_toko.jam_buka?.trim() || "08:00",
        jam_tutup: body.buat_toko.jam_tutup?.trim() || "18:00",
      });
    } catch (error) {
      console.error("Gagal membuat toko dari pengajuan mitra:", error);
      return Response.json({ error: "Gagal membuat entri toko" }, { status: 500 });
    }
  }

  const catatanAdmin =
    body.catatan_admin !== undefined ? body.catatan_admin.trim() || null : undefined;

  try {
    await db
      .update(partnerApplications)
      .set({
        status,
        ...(catatanAdmin !== undefined ? { catatan_admin: catatanAdmin } : {}),
      })
      .where(eq(partnerApplications.id, id));

    return Response.json({ message: "Pengajuan diperbarui" });
  } catch (error) {
    console.error("Gagal memperbarui pengajuan mitra:", error);
    return Response.json({ error: "Gagal menyimpan perubahan" }, { status: 500 });
  }
}
