// ==========================================
// Lavanya Upakara — Static Data Store
// Struktur mengikuti skema PRD (Section 6)
// ==========================================

export interface Store {
  id: string;
  nama_toko: string;
  alamat: string;
  latitude: number;
  longitude: number;
  kategori: string[];
  emoji: string;
  image: string;
  jarak?: string;
}

export interface Category {
  id: string;
  slug: string;
  nama: string;
  emoji: string;
  image: string;
  tag: string;
  gradient: string;
  jumlah_produk: string;
  large?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  store_id: string;
  nama_produk: string;
  kategori: string;
  kategori_slug: string;
  harga: number;
  deskripsi: string;
  emoji: string;
  image: string;
  bg_color: string;
  populer?: boolean;
}

// ==========================================
// STORES
// ==========================================
export const stores: Store[] = [
  {
    id: "store-1",
    nama_toko: "Toko Merta Sari",
    alamat: "Jl. Raya Ubud No. 12, Ubud, Gianyar",
    latitude: -8.5069,
    longitude: 115.2625,
    kategori: ["Canang", "Dupa", "Sesajen"],
    emoji: "🏪",
    image: "/images/stores/default-store.png",
    jarak: "0.3 km",
  },
  {
    id: "store-2",
    nama_toko: "Dagang Banten Bu Wayan",
    alamat: "Jl. Nusa Indah No. 5, Denpasar",
    latitude: -8.6525,
    longitude: 115.2192,
    kategori: ["Dulang", "Bokor", "Pakaian"],
    emoji: "🕌",
    image: "/images/stores/default-store.png",
    jarak: "0.8 km",
  },
  {
    id: "store-3",
    nama_toko: "UD Dharma Puja",
    alamat: "Jl. Gatot Subroto No. 88, Denpasar",
    latitude: -8.6705,
    longitude: 115.2126,
    kategori: ["Sesajen", "Dupa", "Lilin"],
    emoji: "🛕",
    image: "/images/stores/default-store.png",
    jarak: "1.2 km",
  },
  {
    id: "store-4",
    nama_toko: "Toko Puja Mandala",
    alamat: "Jl. Sunset Road No. 45, Kuta",
    latitude: -8.7230,
    longitude: 115.1697,
    kategori: ["Pakaian", "Dulang", "Bokor"],
    emoji: "🪷",
    image: "/images/stores/default-store.png",
    jarak: "2.5 km",
  },
  {
    id: "store-5",
    nama_toko: "Warung Canang Ibu Ketut",
    alamat: "Jl. Monkey Forest No. 23, Ubud",
    latitude: -8.5175,
    longitude: 115.2586,
    kategori: ["Canang", "Bunga", "Taledan"],
    emoji: "🌺",
    image: "/images/stores/default-store.png",
    jarak: "3.1 km",
  },
  {
    id: "store-6",
    nama_toko: "Banten Jaya Sempurna",
    alamat: "Jl. Bypass Ngurah Rai No. 100, Sanur",
    latitude: -8.6936,
    longitude: 115.2615,
    kategori: ["Sesajen", "Canang", "Dulang", "Buah"],
    emoji: "🏛️",
    image: "/images/stores/default-store.png",
    jarak: "4.0 km",
  },
];

// ==========================================
// CATEGORIES
// ==========================================
export const categories: Category[] = [
  {
    id: "cat-1",
    slug: "sesajen",
    nama: "Sesajen & Canang Sari",
    emoji: "🌺",
    image: "/images/categories/sesajen.png",
    tag: "Terlaris",
    gradient: "linear-gradient(135deg, #B84A2A, #D4790A)",
    jumlah_produk: "1.200+ produk tersedia",
    large: true,
  },
  {
    id: "cat-2",
    slug: "dupa-lilin",
    nama: "Dupa & Lilin",
    emoji: "🕯️",
    image: "/images/categories/dupa-lilin.png",
    tag: "Habis Pakai",
    gradient: "linear-gradient(135deg, #2D6A4F, #3D8B65)",
    jumlah_produk: "340+ produk",
  },
  {
    id: "cat-3",
    slug: "taledan-buah",
    nama: "Taledan & Buah",
    emoji: "🍎",
    image: "/images/categories/taledan-buah.png",
    tag: "Segar Setiap Hari",
    gradient: "linear-gradient(135deg, #5C3D1E, #8B6040)",
    jumlah_produk: "180+ produk",
  },
  {
    id: "cat-4",
    slug: "dulang-bokor",
    nama: "Dulang & Bokor",
    emoji: "🏺",
    image: "/images/categories/dulang-bokor.png",
    tag: "Perlengkapan",
    gradient: "linear-gradient(135deg, #9A4F0A, #C97B2A)",
    jumlah_produk: "260+ produk",
  },
  {
    id: "cat-5",
    slug: "pakaian",
    nama: "Pakaian Adat Bali",
    emoji: "👘",
    image: "/images/categories/pakaian.png",
    tag: "Pakaian",
    gradient: "linear-gradient(135deg, #2A4D6A, #3A6D8A)",
    jumlah_produk: "95+ produk",
  },
];

// ==========================================
// PRODUCTS
// ==========================================
export const products: Product[] = [
  // === Sesajen & Canang ===
  {
    id: "prod-1",
    slug: "canang-sari-harian",
    store_id: "store-1",
    nama_produk: "Canang Sari Harian",
    kategori: "Sesajen & Canang Sari",
    kategori_slug: "sesajen",
    harga: 5000,
    deskripsi:
      "Canang sari lengkap dengan bunga segar, porosan, dan sampian untuk persembahyangan harian. Dibuat fresh setiap pagi oleh pengrajin berpengalaman.",
    emoji: "🌸",
    image: "/images/products/canang-sari-harian.png",
    bg_color: "#FDF0DC",
    populer: true,
  },
  {
    id: "prod-2",
    slug: "canang-ceper",
    store_id: "store-1",
    nama_produk: "Canang Ceper",
    kategori: "Sesajen & Canang Sari",
    kategori_slug: "sesajen",
    harga: 3000,
    deskripsi:
      "Canang ceper untuk sembahyang harian. Ukuran standar dengan kualitas daun kelapa pilihan.",
    emoji: "🪻",
    image: "/images/products/canang-ceper.png",
    bg_color: "#FDF0DC",
  },
  {
    id: "prod-3",
    slug: "banten-pejati",
    store_id: "store-2",
    nama_produk: "Banten Pejati",
    kategori: "Sesajen & Canang Sari",
    kategori_slug: "sesajen",
    harga: 75000,
    deskripsi:
      "Banten pejati lengkap untuk upacara. Terdiri dari berbagai jenis sesajen yang disusun rapi dengan makna spiritual mendalam.",
    emoji: "🎋",
    image: "/images/products/banten-pejati.png",
    bg_color: "#FDF0DC",
  },
  {
    id: "prod-4",
    slug: "canang-gede",
    store_id: "store-5",
    nama_produk: "Canang Gede",
    kategori: "Sesajen & Canang Sari",
    kategori_slug: "sesajen",
    harga: 15000,
    deskripsi:
      "Canang ukuran besar untuk persembahyangan khusus. Dilengkapi dengan bunga warna-warni segar pilihan.",
    emoji: "💐",
    image: "/images/products/canang-gede.png",
    bg_color: "#FDF0DC",
    populer: true,
  },
  {
    id: "prod-21",
    slug: "daksina-lengkap",
    store_id: "store-1",
    nama_produk: "Daksina Lengkap",
    kategori: "Sesajen & Canang Sari",
    kategori_slug: "sesajen",
    harga: 25000,
    deskripsi:
      "Daksina lengkap dengan kelapa, telur itik, pisang, dan perlengkapan lainnya. Dibuat rapi dan bersih sesuai pakem persembahyangan.",
    emoji: "🥥",
    image: "/images/products/banten-pejati.png",
    bg_color: "#FDF0DC",
    populer: true,
  },
  {
    id: "prod-22",
    slug: "segehan-panca-warna",
    store_id: "store-2",
    nama_produk: "Segehan Panca Warna",
    kategori: "Sesajen & Canang Sari",
    kategori_slug: "sesajen",
    harga: 10000,
    deskripsi:
      "Segehan panca warna lengkap dengan bawang jahe dan tetabuhan untuk mengharmoniskan alam sekitar (Bhuta Yadnya).",
    emoji: "🍙",
    image: "/images/products/canang-sari-harian.png",
    bg_color: "#FDF0DC",
  },
  {
    id: "prod-5",
    slug: "sesajen-galungan",
    store_id: "store-6",
    nama_produk: "Sesajen Galungan Komplit",
    kategori: "Sesajen & Canang Sari",
    kategori_slug: "sesajen",
    harga: 250000,
    deskripsi:
      "Paket sesajen lengkap untuk Hari Raya Galungan. Termasuk penjor mini, lamak, dan berbagai jenis canang.",
    emoji: "🎍",
    image: "/images/products/sesajen-galungan.png",
    bg_color: "#FDF0DC",
  },

  // === Dupa & Lilin ===
  {
    id: "prod-6",
    slug: "dupa-harum-pandan",
    store_id: "store-3",
    nama_produk: "Dupa Harum Pandan",
    kategori: "Dupa & Lilin",
    kategori_slug: "dupa-lilin",
    harga: 8500,
    deskripsi:
      "Dupa dengan aroma pandan wangi yang menenangkan. Isi 50 batang per bungkus. Cocok untuk sembahyang harian.",
    emoji: "🪔",
    image: "/images/products/dupa-harum-pandan.png",
    bg_color: "#E8F5EE",
    populer: true,
  },
  {
    id: "prod-7",
    slug: "dupa-cendana",
    store_id: "store-3",
    nama_produk: "Dupa Cendana Premium",
    kategori: "Dupa & Lilin",
    kategori_slug: "dupa-lilin",
    harga: 15000,
    deskripsi:
      "Dupa aroma kayu cendana asli Bali. Wanginya tahan lama dan menenangkan. Isi 30 batang.",
    emoji: "🧶",
    image: "/images/products/dupa-cendana.png",
    bg_color: "#E8F5EE",
  },
  {
    id: "prod-8",
    slug: "lilin-merah-sembahyang",
    store_id: "store-3",
    nama_produk: "Lilin Merah Sembahyang",
    kategori: "Dupa & Lilin",
    kategori_slug: "dupa-lilin",
    harga: 12000,
    deskripsi:
      "Lilin merah tradisional untuk perlengkapan sembahyang. Terbuat dari parafin berkualitas, nyala tahan lama.",
    emoji: "🕯️",
    image: "/images/products/lilin-merah.png",
    bg_color: "#E8F5EE",
  },
  {
    id: "prod-9",
    slug: "pasepan-dupa-kerucut",
    store_id: "store-1",
    nama_produk: "Pasepan Dupa Kerucut",
    kategori: "Dupa & Lilin",
    kategori_slug: "dupa-lilin",
    harga: 20000,
    deskripsi:
      "Dupa kerucut (cone) dengan aroma campuran bunga kamboja dan menyan. Asapnya melambangkan doa yang naik ke atas.",
    emoji: "🔥",
    image: "/images/products/pasepan-dupa-kerucut.png",
    bg_color: "#E8F5EE",
  },

  // === Taledan & Buah ===
  {
    id: "prod-10",
    slug: "taledan-buah-segar",
    store_id: "store-5",
    nama_produk: "Taledan Buah Segar",
    kategori: "Taledan & Buah",
    kategori_slug: "taledan-buah",
    harga: 22000,
    deskripsi:
      "Taledan berisi buah-buahan segar pilihan untuk sesajen. Termasuk pisang, apel, jeruk, dan buah naga.",
    emoji: "🥭",
    image: "/images/products/taledan-buah-segar.png",
    bg_color: "#FAE9E4",
    populer: true,
  },
  {
    id: "prod-11",
    slug: "buah-sesajen-komplit",
    store_id: "store-6",
    nama_produk: "Buah Sesajen Komplit",
    kategori: "Taledan & Buah",
    kategori_slug: "taledan-buah",
    harga: 45000,
    deskripsi:
      "Paket buah lengkap untuk sesajen besar. 8 jenis buah segar termasuk kelapa muda dan pisang raja.",
    emoji: "🍉",
    image: "/images/products/buah-sesajen-komplit.png",
    bg_color: "#FAE9E4",
  },
  {
    id: "prod-12",
    slug: "jajan-bali-tradisional",
    store_id: "store-5",
    nama_produk: "Jajan Bali Tradisional",
    kategori: "Taledan & Buah",
    kategori_slug: "taledan-buah",
    harga: 18000,
    deskripsi:
      "Aneka jajan Bali untuk melengkapi taledan. Termasuk jajan uli, klepon, dan dodol.",
    emoji: "🍡",
    image: "/images/products/jajan-bali.png",
    bg_color: "#FAE9E4",
  },

  // === Dulang & Bokor ===
  {
    id: "prod-13",
    slug: "bokor-kuningan",
    store_id: "store-2",
    nama_produk: "Bokor Kuningan",
    kategori: "Dulang & Bokor",
    kategori_slug: "dulang-bokor",
    harga: 185000,
    deskripsi:
      "Bokor kuningan asli dengan ukiran tradisional Bali. Diameter 20cm, cocok untuk wadah sesajen dan air suci.",
    emoji: "🏺",
    image: "/images/products/bokor-kuningan.png",
    bg_color: "#F5EDD8",
    populer: true,
  },
  {
    id: "prod-14",
    slug: "dulang-kayu-cendana",
    store_id: "store-4",
    nama_produk: "Dulang Kayu Cendana",
    kategori: "Dulang & Bokor",
    kategori_slug: "dulang-bokor",
    harga: 320000,
    deskripsi:
      "Dulang dari kayu cendana dengan ukiran halus. Tinggi 30cm, diameter 25cm. Tahan lama dan beraroma harum.",
    emoji: "🪵",
    image: "/images/products/dulang-kayu-cendana.png",
    bg_color: "#F5EDD8",
  },
  {
    id: "prod-15",
    slug: "payung-tedung",
    store_id: "store-4",
    nama_produk: "Payung Tedung Putih Kuning",
    kategori: "Dulang & Bokor",
    kategori_slug: "dulang-bokor",
    harga: 150000,
    deskripsi:
      "Payung tedung tradisional warna putih-kuning untuk perlengkapan upacara. Tinggi 120cm, bahan kain satin.",
    emoji: "⛱️",
    image: "/images/products/payung-tedung.png",
    bg_color: "#F5EDD8",
  },
  {
    id: "prod-16",
    slug: "sangku-air-suci",
    store_id: "store-2",
    nama_produk: "Sangku Air Suci",
    kategori: "Dulang & Bokor",
    kategori_slug: "dulang-bokor",
    harga: 95000,
    deskripsi:
      "Sangku (wadah air suci) dari kuningan dengan tutup. Ukuran sedang, cocok untuk sembahyang harian.",
    emoji: "🫗",
    image: "/images/products/sangku-air-suci.png",
    bg_color: "#F5EDD8",
  },

  // === Pakaian Adat ===
  {
    id: "prod-17",
    slug: "kebaya-brokat-putih",
    store_id: "store-4",
    nama_produk: "Kebaya Brokat Putih",
    kategori: "Pakaian Adat Bali",
    kategori_slug: "pakaian",
    harga: 275000,
    deskripsi:
      "Kebaya brokat putih untuk wanita, cocok untuk sembahyang di pura. Bahan brokat premium, nyaman dipakai.",
    emoji: "👗",
    image: "/images/products/kebaya-brokat-putih.png",
    bg_color: "#E8F0F5",
  },
  {
    id: "prod-18",
    slug: "udeng-bali-putih",
    store_id: "store-4",
    nama_produk: "Udeng Bali Putih",
    kategori: "Pakaian Adat Bali",
    kategori_slug: "pakaian",
    harga: 55000,
    deskripsi:
      "Udeng (ikat kepala) putih polos untuk pria. Bahan katun premium, sudah dilipat siap pakai.",
    emoji: "🎀",
    image: "/images/products/udeng-bali-putih.png",
    bg_color: "#E8F0F5",
    populer: true,
  },
  {
    id: "prod-19",
    slug: "kamen-saput-endek",
    store_id: "store-4",
    nama_produk: "Kamen Saput Endek",
    kategori: "Pakaian Adat Bali",
    kategori_slug: "pakaian",
    harga: 180000,
    deskripsi:
      "Kamen saput dari kain endek Bali asli. Motif tradisional, cocok untuk acara adat dan sembahyang.",
    emoji: "🧣",
    image: "/images/products/kamen-saput-endek.png",
    bg_color: "#E8F0F5",
  },
  {
    id: "prod-20",
    slug: "selendang-sembahyang",
    store_id: "store-2",
    nama_produk: "Selendang Sembahyang",
    kategori: "Pakaian Adat Bali",
    kategori_slug: "pakaian",
    harga: 45000,
    deskripsi:
      "Selendang kuning emas untuk dipakai saat sembahyang. Bahan satin halus, panjang 200cm.",
    emoji: "💛",
    image: "/images/products/selendang-sembahyang.png",
    bg_color: "#E8F0F5",
  },
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getStoreById(id: string): Store | undefined {
  return stores.find((s) => s.id === id);
}

export function getProductsByCategory(kategoriSlug: string): Product[] {
  return products.filter((p) => p.kategori_slug === kategoriSlug);
}

export function getPopularProducts(): Product[] {
  return products.filter((p) => p.populer);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.nama_produk.toLowerCase().includes(q) ||
      p.kategori.toLowerCase().includes(q) ||
      p.deskripsi.toLowerCase().includes(q)
  );
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
