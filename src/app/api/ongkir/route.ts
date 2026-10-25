// POST /api/ongkir — perkiraan ongkir per toko untuk titik antar tertentu.
// Hanya untuk ditampilkan di checkout; POST /api/orders menghitung ulang.

import { db } from "@/db";
import { stores } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { hitungOngkir } from "@/lib/ongkir";

export async function POST(request: Request) {
  let body: { lat?: unknown; lng?: unknown; store_ids?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const lat = Number(body.lat);
  const lng = Number(body.lng);
  const storeIds = Array.isArray(body.store_ids)
    ? body.store_ids.filter((s): s is string => typeof s === "string").slice(0, 20)
    : [];
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || storeIds.length === 0) {
    return Response.json({ error: "Titik antar dan toko wajib diisi" }, { status: 400 });
  }

  const daftar = await db
    .select({ id: stores.id, nama: stores.nama_toko, lat: stores.latitude, lng: stores.longitude })
    .from(stores)
    .where(inArray(stores.id, storeIds));

  return Response.json({
    toko: daftar.map((t) => ({
      store_id: t.id,
      nama_toko: t.nama,
      ...hitungOngkir({ lat: t.lat, lng: t.lng }, { lat, lng }),
    })),
  });
}
