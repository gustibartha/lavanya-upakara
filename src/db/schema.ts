// ==========================================
// Lavanya Upakara — Drizzle ORM Schema
// Sesuai PRD Section 6: Database Schema
// ==========================================

import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// --- USER ---
// Managed by Better Auth (see auth-schema.ts)
// Tables: user, session, account, verification

// --- STORE (Toko) ---
export const stores = sqliteTable("stores", {
  id: text("id").primaryKey(),
  nama_toko: text("nama_toko").notNull(),
  alamat: text("alamat").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  kategori: text("kategori").notNull(), // JSON array stored as text
  emoji: text("emoji").notNull().default("🏪"),
  telepon: text("telepon"),
  jam_buka: text("jam_buka").default("08:00"),
  jam_tutup: text("jam_tutup").default("18:00"),
  created_at: text("created_at").notNull().default("(datetime('now'))"),
});

// --- PRODUCT (Barang) ---
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  store_id: text("store_id")
    .notNull()
    .references(() => stores.id),
  nama_produk: text("nama_produk").notNull(),
  kategori: text("kategori").notNull(),
  kategori_slug: text("kategori_slug").notNull(),
  harga: integer("harga").notNull(),
  deskripsi: text("deskripsi").notNull(),
  emoji: text("emoji").notNull().default("📦"),
  bg_color: text("bg_color").notNull().default("#FDF0DC"),
  populer: integer("populer", { mode: "boolean" }).default(false),
  stok: integer("stok").default(100),
  created_at: text("created_at").notNull().default("(datetime('now'))"),
});

// --- ORDER (Pesanan) ---
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(), // references Better Auth user.id
  store_id: text("store_id")
    .notNull()
    .references(() => stores.id),
  total_harga: integer("total_harga").notNull(),
  status: text("status").notNull().default("menunggu"), // menunggu | diproses | dikirim | selesai
  jalan: text("jalan"),
  kelurahan: text("kelurahan"),
  kecamatan: text("kecamatan"),
  kota: text("kota"),
  provinsi: text("provinsi"),
  kodepos: text("kodepos"),
  shipping_method: text("shipping_method"), // pickup | delivery
  shipping_service: text("shipping_service"), // gojek | grab | paxel
  catatan: text("catatan"),
  created_at: text("created_at").notNull().default("(datetime('now'))"),
});

// --- ORDER_ITEM (Detail Pesanan) ---
export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  order_id: text("order_id")
    .notNull()
    .references(() => orders.id),
  product_id: text("product_id")
    .notNull()
    .references(() => products.id),
  jumlah: integer("jumlah").notNull(),
  harga_satuan: integer("harga_satuan").notNull(),
});

// --- RELATIONS ---
export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
  orders: many(orders),
}));

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, {
    fields: [products.store_id],
    references: [stores.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, {
    fields: [orders.store_id],
    references: [stores.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.order_id],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.product_id],
    references: [products.id],
  }),
}));

// --- TYPE EXPORTS ---
export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
