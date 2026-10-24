// PUT /api/admin/pesanan/[id] — admin memperbarui status pesanan, ongkir,
// dan link pelacakan kurir yang dipesan manual (GoSend/GrabExpress/Paxel).

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminApi } from "@/lib/admin/guard";
import { ORDER_STATUS, trackingUrlAman } from "@/lib/order-status";

interface PesananInput {
  status?: unknown;
  ongkir?: unknown;
  tracking_url?: unknown;
}

const STATUS_FINAL = new Set(["selesai", "dibatalkan"]);
const STATUS_BUTUH_LUNAS = new Set(["diproses", "dikirim", "selesai"]);
const MAKS_ONGKIR = 1_000_000;

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdminApi();
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: PesananInput;
  try {
    body = (await request.json()) as PesananInput;
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const [pesanan] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!pesanan) {
    return Response.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  const perubahan: Partial<typeof orders.$inferInsert> = {};

  if (body.status !== undefined && body.status !== pesanan.status) {
    const status = String(body.status);
    if (!ORDER_STATUS[status]) {
      return Response.json({ error: "Status tidak valid" }, { status: 400 });
    }
    if (STATUS_FINAL.has(pesanan.status)) {
      return Response.json(
        { error: `Pesanan sudah ${ORDER_STATUS[pesanan.status].label.toLowerCase()} dan tidak bisa diubah lagi` },
        { status: 409 },
      );
    }
    // Pesanan online jangan diproses sebelum uangnya benar-benar masuk.
    if (
      STATUS_BUTUH_LUNAS.has(status) &&
      pesanan.metode_bayar === "midtrans" &&
      pesanan.status_bayar !== "dibayar"
    ) {
      return Response.json(
        { error: "Pesanan ini dibayar online dan belum lunas — tunggu pembayaran masuk sebelum diproses" },
        { status: 409 },
      );
    }
    perubahan.status = status;
  }

  if (body.ongkir !== undefined) {
    if (body.ongkir === null || body.ongkir === "") {
      perubahan.ongkir = null;
    } else {
      const ongkir = Number(body.ongkir);
      if (!Number.isInteger(ongkir) || ongkir < 0 || ongkir > MAKS_ONGKIR) {
        return Response.json({ error: "Ongkir harus angka bulat rupiah" }, { status: 400 });
      }
      perubahan.ongkir = ongkir;
    }
  }

  if (body.tracking_url !== undefined) {
    const mentah = typeof body.tracking_url === "string" ? body.tracking_url.trim() : "";
    if (!mentah) {
      perubahan.tracking_url = null;
    } else {
      const aman = trackingUrlAman(mentah);
      if (!aman) {
        return Response.json(
          { error: "Link pelacakan harus diawali https:// (salin dari aplikasi Gojek/Grab)" },
          { status: 400 },
        );
      }
      perubahan.tracking_url = aman;
    }
  }

  if (Object.keys(perubahan).length === 0) {
    return Response.json({ message: "Tidak ada perubahan" });
  }

  try {
    await db.update(orders).set(perubahan).where(eq(orders.id, id));
    return Response.json({ message: "Pesanan diperbarui", perubahan });
  } catch (error) {
    console.error("Gagal memperbarui pesanan:", error);
    return Response.json({ error: "Gagal menyimpan perubahan" }, { status: 500 });
  }
}
