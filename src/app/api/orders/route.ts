// POST /api/orders — membuat pesanan dari isi keranjang.
//
// Satu keranjang bisa berisi produk dari beberapa toko. Tiap toko
// memproses dan mengirim pesanannya sendiri, jadi keranjang dipecah menjadi
// satu pesanan per toko — bukan dicatat semuanya atas nama satu toko.

import db from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface OrderItemInput {
  product_id?: unknown;
  jumlah?: unknown;
}

interface OrderInput {
  items?: OrderItemInput[];
  jalan?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
  kodepos?: string;
  shipping_method?: string;
  shipping_service?: string;
  lokasi_lat?: unknown;
  lokasi_lng?: unknown;
  catatan?: string;
  metode_bayar?: string;
}

const MAKS_JUMLAH_PER_PRODUK = 99;
const MAKS_JENIS_PRODUK = 50;

export async function POST(request: Request) {
  // Pemilik pesanan diambil dari sesi, bukan dari isi permintaan — kalau
  // tidak, siapa pun bisa membuat pesanan atas nama akun orang lain.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Silakan masuk terlebih dahulu" }, { status: 401 });
  }

  let body: OrderInput;
  try {
    body = (await request.json()) as OrderInput;
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return Response.json({ error: "Keranjang kosong" }, { status: 400 });
  }
  if (body.items.length > MAKS_JENIS_PRODUK) {
    return Response.json({ error: "Terlalu banyak jenis produk" }, { status: 400 });
  }

  // Produk yang sama yang muncul dua kali digabung jumlahnya.
  const jumlahPerProduk = new Map<string, number>();
  for (const item of body.items) {
    const jumlah = Number(item.jumlah);
    if (typeof item.product_id !== "string" || !Number.isInteger(jumlah) || jumlah < 1) {
      return Response.json({ error: "Jumlah produk tidak valid" }, { status: 400 });
    }
    const total = (jumlahPerProduk.get(item.product_id) ?? 0) + jumlah;
    if (total > MAKS_JUMLAH_PER_PRODUK) {
      return Response.json(
        { error: `Maksimal ${MAKS_JUMLAH_PER_PRODUK} per produk dalam satu pesanan` },
        { status: 400 },
      );
    }
    jumlahPerProduk.set(item.product_id, total);
  }

  const shippingMethod = body.shipping_method === "delivery" ? "delivery" : "pickup";
  if (shippingMethod === "delivery" && (!body.jalan?.trim() || !body.kota?.trim())) {
    return Response.json({ error: "Alamat pengiriman belum lengkap" }, { status: 400 });
  }

  // Kurir instan butuh titik koordinat. Batasnya kira-kira wilayah
  // Indonesia, sekadar menolak nilai yang jelas salah.
  const lat = Number(body.lokasi_lat);
  const lng = Number(body.lokasi_lng);
  const titikValid =
    Number.isFinite(lat) && Number.isFinite(lng) && lat >= -11 && lat <= 6 && lng >= 95 && lng <= 141;
  if (shippingMethod === "delivery" && !titikValid) {
    return Response.json({ error: "Tandai titik antar di peta" }, { status: 400 });
  }

  // Hanya dua metode yang dikenal; nilai lain diperlakukan sebagai COD.
  const metodeBayar = body.metode_bayar === "midtrans" ? "midtrans" : "cod";

  try {
    const idProduk = [...jumlahPerProduk.keys()];
    const daftarProduk = await db
      .select()
      .from(products)
      .where(and(inArray(products.id, idProduk), eq(products.aktif, true)));

    if (daftarProduk.length !== idProduk.length) {
      return Response.json(
        {
          error:
            "Sebagian produk di keranjang sudah tidak tersedia. Hapus produk tersebut dari keranjang lalu coba lagi.",
          produk_tidak_tersedia: idProduk.filter(
            (id) => !daftarProduk.some((p) => p.id === id),
          ),
        },
        { status: 409 },
      );
    }

    // Harga selalu diambil dari database — harga yang dikirim browser
    // tidak pernah dipercaya.
    const perToko = new Map<string, typeof daftarProduk>();
    for (const p of daftarProduk) {
      perToko.set(p.store_id, [...(perToko.get(p.store_id) ?? []), p]);
    }

    const pesananDibuat = [];
    for (const [storeId, produkToko] of perToko) {
      const orderId = `order-${randomUUID().slice(0, 8)}`;
      const totalHarga = produkToko.reduce(
        (sum, p) => sum + p.harga * jumlahPerProduk.get(p.id)!,
        0,
      );

      await db.insert(orders).values({
        id: orderId,
        user_id: session.user.id,
        store_id: storeId,
        total_harga: totalHarga,
        status: "menunggu",
        jalan: shippingMethod === "pickup" ? "Ambil di Toko" : body.jalan?.trim() || null,
        kelurahan: body.kelurahan || null,
        kecamatan: body.kecamatan || null,
        kota: body.kota || null,
        provinsi: body.provinsi || null,
        kodepos: body.kodepos || null,
        shipping_method: shippingMethod,
        shipping_service: shippingMethod === "delivery" ? body.shipping_service || null : null,
        lokasi_lat: shippingMethod === "delivery" ? lat : null,
        lokasi_lng: shippingMethod === "delivery" ? lng : null,
        catatan: body.catatan?.trim().slice(0, 500) || null,
        metode_bayar: metodeBayar,
        status_bayar: "belum_bayar",
      });

      await db.insert(orderItems).values(
        produkToko.map((p) => ({
          id: `oi-${randomUUID().slice(0, 8)}`,
          order_id: orderId,
          product_id: p.id,
          jumlah: jumlahPerProduk.get(p.id)!,
          harga_satuan: p.harga,
        })),
      );

      pesananDibuat.push({
        id: orderId,
        store_id: storeId,
        total_harga: totalHarga,
        status: "menunggu",
        metode_bayar: metodeBayar,
        status_bayar: "belum_bayar",
        items: produkToko.length,
      });
    }

    return Response.json(
      { orders: pesananDibuat, message: "Pesanan berhasil dibuat! 🙏" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return Response.json({ error: "Gagal membuat pesanan" }, { status: 500 });
  }
}
