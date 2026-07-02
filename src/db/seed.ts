import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

const storesData = [
  {
    id: "store-1",
    nama_toko: "Toko Merta Sari",
    alamat: "Jl. Raya Ubud No. 12, Ubud, Gianyar",
    latitude: -8.5069,
    longitude: 115.2625,
    kategori: JSON.stringify(["Canang", "Dupa", "Sesajen"]),
    emoji: "🏪",
    telepon: "0361-971234",
    jam_buka: "06:00",
    jam_tutup: "20:00",
  },
  {
    id: "store-2",
    nama_toko: "Dagang Banten Bu Wayan",
    alamat: "Jl. Nusa Indah No. 5, Denpasar",
    latitude: -8.6525,
    longitude: 115.2192,
    kategori: JSON.stringify(["Dulang", "Bokor", "Pakaian"]),
    emoji: "🕌",
    telepon: "0361-225678",
    jam_buka: "07:00",
    jam_tutup: "19:00",
  },
  {
    id: "store-3",
    nama_toko: "UD Dharma Puja",
    alamat: "Jl. Gatot Subroto No. 88, Denpasar",
    latitude: -8.6705,
    longitude: 115.2126,
    kategori: JSON.stringify(["Sesajen", "Dupa", "Lilin"]),
    emoji: "🛕",
    telepon: "0361-430987",
    jam_buka: "06:30",
    jam_tutup: "21:00",
  },
  {
    id: "store-4",
    nama_toko: "Toko Puja Mandala",
    alamat: "Jl. Sunset Road No. 45, Kuta",
    latitude: -8.7230,
    longitude: 115.1697,
    kategori: JSON.stringify(["Pakaian", "Dulang", "Bokor"]),
    emoji: "🪷",
    telepon: "0361-756432",
    jam_buka: "08:00",
    jam_tutup: "18:00",
  },
  {
    id: "store-5",
    nama_toko: "Warung Canang Ibu Ketut",
    alamat: "Jl. Monkey Forest No. 23, Ubud",
    latitude: -8.5175,
    longitude: 115.2586,
    kategori: JSON.stringify(["Canang", "Bunga", "Taledan"]),
    emoji: "🌺",
    telepon: "0361-975123",
    jam_buka: "05:30",
    jam_tutup: "19:00",
  },
  {
    id: "store-6",
    nama_toko: "Banten Jaya Sempurna",
    alamat: "Jl. Bypass Ngurah Rai No. 100, Sanur",
    latitude: -8.6936,
    longitude: 115.2615,
    kategori: JSON.stringify(["Sesajen", "Canang", "Dulang", "Buah"]),
    emoji: "🏛️",
    telepon: "0361-288456",
    jam_buka: "06:00",
    jam_tutup: "22:00",
  },
];

const productsData = [
  { id: "prod-1", slug: "canang-sari-harian", store_id: "store-1", nama_produk: "Canang Sari Harian", kategori: "Sesajen & Canang Sari", kategori_slug: "sesajen", harga: 5000, deskripsi: "Canang sari lengkap dengan bunga segar, porosan, dan sampian untuk persembahyangan harian. Dibuat fresh setiap pagi oleh pengrajin berpengalaman.", emoji: "🌸", bg_color: "#FDF0DC", populer: true },
  { id: "prod-2", slug: "canang-ceper", store_id: "store-1", nama_produk: "Canang Ceper", kategori: "Sesajen & Canang Sari", kategori_slug: "sesajen", harga: 3000, deskripsi: "Canang ceper untuk sembahyang harian. Ukuran standar dengan kualitas daun kelapa pilihan.", emoji: "🪻", bg_color: "#FDF0DC", populer: false },
  { id: "prod-3", slug: "banten-pejati", store_id: "store-2", nama_produk: "Banten Pejati", kategori: "Sesajen & Canang Sari", kategori_slug: "sesajen", harga: 75000, deskripsi: "Banten pejati lengkap untuk upacara. Terdiri dari berbagai jenis sesajen yang disusun rapi dengan makna spiritual mendalam.", emoji: "🎋", bg_color: "#FDF0DC", populer: false },
  { id: "prod-4", slug: "canang-gede", store_id: "store-5", nama_produk: "Canang Gede", kategori: "Sesajen & Canang Sari", kategori_slug: "sesajen", harga: 15000, deskripsi: "Canang ukuran besar untuk persembahyangan khusus. Dilengkapi dengan bunga warna-warni segar pilihan.", emoji: "💐", bg_color: "#FDF0DC", populer: true },
  { id: "prod-5", slug: "sesajen-galungan", store_id: "store-6", nama_produk: "Sesajen Galungan Komplit", kategori: "Sesajen & Canang Sari", kategori_slug: "sesajen", harga: 250000, deskripsi: "Paket sesajen lengkap untuk Hari Raya Galungan. Termasuk penjor mini, lamak, dan berbagai jenis canang.", emoji: "🎍", bg_color: "#FDF0DC", populer: false },
  { id: "prod-6", slug: "dupa-harum-pandan", store_id: "store-3", nama_produk: "Dupa Harum Pandan", kategori: "Dupa & Lilin", kategori_slug: "dupa-lilin", harga: 8500, deskripsi: "Dupa dengan aroma pandan wangi yang menenangkan. Isi 50 batang per bungkus. Cocok untuk sembahyang harian.", emoji: "🪔", bg_color: "#E8F5EE", populer: true },
  { id: "prod-7", slug: "dupa-cendana", store_id: "store-3", nama_produk: "Dupa Cendana Premium", kategori: "Dupa & Lilin", kategori_slug: "dupa-lilin", harga: 15000, deskripsi: "Dupa aroma kayu cendana asli Bali. Wanginya tahan lama dan menenangkan. Isi 30 batang.", emoji: "🧶", bg_color: "#E8F5EE", populer: false },
  { id: "prod-8", slug: "lilin-merah-sembahyang", store_id: "store-3", nama_produk: "Lilin Merah Sembahyang", kategori: "Dupa & Lilin", kategori_slug: "dupa-lilin", harga: 12000, deskripsi: "Lilin merah tradisional untuk perlengkapan sembahyang. Terbuat dari parafin berkualitas, nyala tahan lama.", emoji: "🕯️", bg_color: "#E8F5EE", populer: false },
  { id: "prod-9", slug: "pasepan-dupa-kerucut", store_id: "store-1", nama_produk: "Pasepan Dupa Kerucut", kategori: "Dupa & Lilin", kategori_slug: "dupa-lilin", harga: 20000, deskripsi: "Dupa kerucut (cone) dengan aroma campuran bunga kamboja dan menyan. Asapnya melambangkan doa yang naik ke atas.", emoji: "🔥", bg_color: "#E8F5EE", populer: false },
  { id: "prod-10", slug: "taledan-buah-segar", store_id: "store-5", nama_produk: "Taledan Buah Segar", kategori: "Taledan & Buah", kategori_slug: "taledan-buah", harga: 22000, deskripsi: "Taledan berisi buah-buahan segar pilihan untuk sesajen. Termasuk pisang, apel, jeruk, dan buah naga.", emoji: "🥭", bg_color: "#FAE9E4", populer: true },
  { id: "prod-11", slug: "buah-sesajen-komplit", store_id: "store-6", nama_produk: "Buah Sesajen Komplit", kategori: "Taledan & Buah", kategori_slug: "taledan-buah", harga: 45000, deskripsi: "Paket buah lengkap untuk sesajen besar. 8 jenis buah segar termasuk kelapa muda dan pisang raja.", emoji: "🍉", bg_color: "#FAE9E4", populer: false },
  { id: "prod-12", slug: "jajan-bali-tradisional", store_id: "store-5", nama_produk: "Jajan Bali Tradisional", kategori: "Taledan & Buah", kategori_slug: "taledan-buah", harga: 18000, deskripsi: "Aneka jajan Bali untuk melengkapi taledan. Termasuk jajan uli, klepon, dan dodol.", emoji: "🍡", bg_color: "#FAE9E4", populer: false },
  { id: "prod-13", slug: "bokor-kuningan", store_id: "store-2", nama_produk: "Bokor Kuningan", kategori: "Dulang & Bokor", kategori_slug: "dulang-bokor", harga: 185000, deskripsi: "Bokor kuningan asli dengan ukiran tradisional Bali. Diameter 20cm, cocok untuk wadah sesajen dan air suci.", emoji: "🏺", bg_color: "#F5EDD8", populer: true },
  { id: "prod-14", slug: "dulang-kayu-cendana", store_id: "store-4", nama_produk: "Dulang Kayu Cendana", kategori: "Dulang & Bokor", kategori_slug: "dulang-bokor", harga: 320000, deskripsi: "Dulang dari kayu cendana dengan ukiran halus. Tinggi 30cm, diameter 25cm. Tahan lama dan beraroma harum.", emoji: "🪵", bg_color: "#F5EDD8", populer: false },
  { id: "prod-15", slug: "payung-tedung", store_id: "store-4", nama_produk: "Payung Tedung Putih Kuning", kategori: "Dulang & Bokor", kategori_slug: "dulang-bokor", harga: 150000, deskripsi: "Payung tedung tradisional warna putih-kuning untuk perlengkapan upacara. Tinggi 120cm, bahan kain satin.", emoji: "⛱️", bg_color: "#F5EDD8", populer: false },
  { id: "prod-16", slug: "sangku-air-suci", store_id: "store-2", nama_produk: "Sangku Air Suci", kategori: "Dulang & Bokor", kategori_slug: "dulang-bokor", harga: 95000, deskripsi: "Sangku (wadah air suci) dari kuningan dengan tutup. Ukuran sedang, cocok untuk sembahyang harian.", emoji: "🫗", bg_color: "#F5EDD8", populer: false },
  { id: "prod-17", slug: "kebaya-brokat-putih", store_id: "store-4", nama_produk: "Kebaya Brokat Putih", kategori: "Pakaian Adat Bali", kategori_slug: "pakaian", harga: 275000, deskripsi: "Kebaya brokat putih untuk wanita, cocok untuk sembahyang di pura. Bahan brokat premium, nyaman dipakai.", emoji: "👗", bg_color: "#E8F0F5", populer: false },
  { id: "prod-18", slug: "udeng-bali-putih", store_id: "store-4", nama_produk: "Udeng Bali Putih", kategori: "Pakaian Adat Bali", kategori_slug: "pakaian", harga: 55000, deskripsi: "Udeng (ikat kepala) putih polos untuk pria. Bahan katun premium, sudah dilipat siap pakai.", emoji: "🎀", bg_color: "#E8F0F5", populer: true },
  { id: "prod-19", slug: "kamen-saput-endek", store_id: "store-4", nama_produk: "Kamen Saput Endek", kategori: "Pakaian Adat Bali", kategori_slug: "pakaian", harga: 180000, deskripsi: "Kamen saput dari kain endek Bali asli. Motif tradisional, cocok untuk acara adat dan sembahyang.", emoji: "🧣", bg_color: "#E8F0F5", populer: false },
  { id: "prod-20", slug: "selendang-sembahyang", store_id: "store-2", nama_produk: "Selendang Sembahyang", kategori: "Pakaian Adat Bali", kategori_slug: "pakaian", harga: 45000, deskripsi: "Selendang kuning emas untuk dipakai saat sembahyang. Bahan satin halus, panjang 200cm.", emoji: "💛", bg_color: "#E8F0F5", populer: false },
  { id: "prod-21", slug: "daksina-lengkap", store_id: "store-1", nama_produk: "Daksina Lengkap", kategori: "Sesajen & Canang Sari", kategori_slug: "sesajen", harga: 120000, deskripsi: "Banten Daksina lengkap untuk berbagai keperluan upacara Yadnya. Terbuat dari bahan-bahan pilihan sesuai dresta.", emoji: "🥥", bg_color: "#FDF0DC", populer: true },
  { id: "prod-22", slug: "segehan-panca-warna", store_id: "store-5", nama_produk: "Segehan Panca Warna", kategori: "Sesajen & Canang Sari", kategori_slug: "sesajen", harga: 25000, deskripsi: "Segehan Panca Warna lengkap dengan nasi 5 warna untuk persembahan harian atau upacara pecaruan kecil.", emoji: "🍱", bg_color: "#FDF0DC", populer: false },
];

async function seed() {
  console.log("🌱 Seeding database to Supabase...");
  
  try {
    // Clear existing data (optional, be careful in prod!)
    await db.delete(schema.orderItems);
    await db.delete(schema.orders);
    await db.delete(schema.products);
    await db.delete(schema.stores);

    console.log("Cleared existing data.");

    // Insert stores
    for (const store of storesData) {
      await db.insert(schema.stores).values(store);
    }
    console.log(`  ✅ ${storesData.length} toko berhasil ditambahkan`);

    // Insert products
    for (const product of productsData) {
      await db.insert(schema.products).values(product);
    }
    console.log(`  ✅ ${productsData.length} produk berhasil ditambahkan`);

    console.log("\n🎉 Database Supabase berhasil di-seed!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    process.exit(0);
  }
}

seed();
