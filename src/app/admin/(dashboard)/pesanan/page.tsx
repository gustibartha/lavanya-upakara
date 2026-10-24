import { db } from "@/db";
import { orders, orderItems, products, stores } from "@/db/schema";
import { user } from "@/db/auth-schema";
import { desc, eq, inArray } from "drizzle-orm";
import { PesananManager, type PesananAdmin } from "@/components/admin/PesananManager";

export const dynamic = "force-dynamic";

export default async function AdminPesananPage() {
  const rows = await db
    .select({
      order: orders,
      toko: {
        nama: stores.nama_toko,
        alamat: stores.alamat,
        telepon: stores.telepon,
        lat: stores.latitude,
        lng: stores.longitude,
      },
      pembeli: { nama: user.name, email: user.email, telepon: user.phoneNumber },
    })
    .from(orders)
    .leftJoin(stores, eq(orders.store_id, stores.id))
    .leftJoin(user, eq(orders.user_id, user.id))
    .orderBy(desc(orders.created_at))
    .limit(200);

  const ids = rows.map((r) => r.order.id);
  const items = ids.length
    ? await db
        .select({
          order_id: orderItems.order_id,
          nama: products.nama_produk,
          jumlah: orderItems.jumlah,
          harga: orderItems.harga_satuan,
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.product_id, products.id))
        .where(inArray(orderItems.order_id, ids))
    : [];

  const daftar: PesananAdmin[] = rows.map(({ order, toko, pembeli }) => ({
    ...order,
    toko,
    pembeli,
    items: items
      .filter((i) => i.order_id === order.id)
      .map((i) => ({ nama: i.nama ?? "Produk", jumlah: i.jumlah, harga: i.harga })),
  }));

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Kelola Pesanan</h1>
      <p className="admin-page-sub">
        Konfirmasi pesanan, pesan kurir GoSend/GrabExpress/Paxel lewat aplikasinya,
        lalu catat ongkir dan link pelacakannya di sini supaya pembeli bisa
        memantau pengiriman.
      </p>
      <PesananManager pesananAwal={daftar} />
    </div>
  );
}
