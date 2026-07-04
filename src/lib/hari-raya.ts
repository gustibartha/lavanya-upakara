// ==========================================
// Lavanya Upakara — Kalender Hari Raya Hindu Bali
// Tanggal berdasarkan kalender Saka 2025-2026
// ==========================================

export interface HariRaya {
  id: string;
  nama: string;
  emoji: string;
  tanggal: string; // ISO format YYYY-MM-DD
  deskripsi: string;
  banten_wajib: string[];
  makna: string;
  produk_rekomendasi: string[]; // slugs dari data.ts
  warna: string; // untuk UI theming
}

export const kalenderHariRaya: HariRaya[] = [
  // ========================
  // GALUNGAN (2025-2026)
  // ========================
  {
    id: "galungan-2025-jul",
    nama: "Hari Raya Galungan",
    emoji: "🎍",
    tanggal: "2025-07-16",
    deskripsi: "Hari kemenangan Dharma (kebaikan) melawan Adharma (kejahatan). Dirayakan setiap 210 hari sekali dalam kalender Pawukon Bali.",
    banten_wajib: ["Penjor", "Canang Gede", "Banten Pejati", "Canang Sari", "Sesajen Lengkap"],
    makna: "Merayakan kemenangan kebenaran atas kejahatan. Penjor dipasang di depan rumah sebagai simbol kemakmuran.",
    produk_rekomendasi: ["sesajen-galungan", "canang-gede", "banten-pejati", "canang-sari-harian", "dupa-cendana"],
    warna: "#B84A2A",
  },
  {
    id: "galungan-2026-feb",
    nama: "Hari Raya Galungan",
    emoji: "🎍",
    tanggal: "2026-02-11",
    deskripsi: "Hari kemenangan Dharma (kebaikan) melawan Adharma (kejahatan). Dirayakan setiap 210 hari sekali dalam kalender Pawukon Bali.",
    banten_wajib: ["Penjor", "Canang Gede", "Banten Pejati", "Canang Sari", "Sesajen Lengkap"],
    makna: "Merayakan kemenangan kebenaran atas kejahatan. Penjor dipasang di depan rumah sebagai simbol kemakmuran.",
    produk_rekomendasi: ["sesajen-galungan", "canang-gede", "banten-pejati", "canang-sari-harian", "dupa-cendana"],
    warna: "#B84A2A",
  },

  // ========================
  // KUNINGAN (10 hari setelah Galungan)
  // ========================
  {
    id: "kuningan-2025-jul",
    nama: "Hari Raya Kuningan",
    emoji: "🌾",
    tanggal: "2025-07-26",
    deskripsi: "Puncak Galungan, hari para dewa dan leluhur kembali ke surga. Ritual khusus menggunakan nasi kuning sebagai simbol.",
    banten_wajib: ["Tamyang", "Canang Sari", "Bokor Berisi Air Suci", "Sesajen Kuning", "Canang Gede"],
    makna: "Mengantarkan kepulangan para leluhur dan dewa ke kahyangan. Tamyang dipasang di sanggah sebagai penghormatan.",
    produk_rekomendasi: ["bokor-kuningan", "canang-sari-harian", "canang-gede", "daksina-lengkap", "dupa-harum-pandan"],
    warna: "#C8690A",
  },
  {
    id: "kuningan-2026-feb",
    nama: "Hari Raya Kuningan",
    emoji: "🌾",
    tanggal: "2026-02-21",
    deskripsi: "Puncak Galungan, hari para dewa dan leluhur kembali ke surga. Ritual khusus menggunakan nasi kuning sebagai simbol.",
    banten_wajib: ["Tamyang", "Canang Sari", "Bokor Berisi Air Suci", "Sesajen Kuning", "Canang Gede"],
    makna: "Mengantarkan kepulangan para leluhur dan dewa ke kahyangan. Tamyang dipasang di sanggah sebagai penghormatan.",
    produk_rekomendasi: ["bokor-kuningan", "canang-sari-harian", "canang-gede", "daksina-lengkap", "dupa-harum-pandan"],
    warna: "#C8690A",
  },

  // ========================
  // NYEPI (Tahun Baru Saka)
  // ========================
  {
    id: "nyepi-2026",
    nama: "Hari Raya Nyepi",
    emoji: "🌑",
    tanggal: "2026-03-19",
    deskripsi: "Tahun Baru Saka Bali. Hari hening total, tidak bekerja, tidak bepergian, tidak menyalakan api/lampu. Diawali dengan Tawur Kesanga.",
    banten_wajib: ["Caru Rsi Gana", "Segehan Panca Warna", "Canang Sari", "Banten Pejati", "Dupa"],
    makna: "Pembersihan alam semesta dari pengaruh negatif. Dilakukan Tawur Agung di Pura Besakih sehari sebelumnya.",
    produk_rekomendasi: ["segehan-panca-warna", "canang-sari-harian", "banten-pejati", "dupa-harum-pandan", "lilin-merah-sembahyang"],
    warna: "#285C42",
  },

  // ========================
  // SARASWATI (6 bulan sekali)
  // ========================
  {
    id: "saraswati-2025-aug",
    nama: "Hari Raya Saraswati",
    emoji: "📚",
    tanggal: "2025-08-23",
    deskripsi: "Hari turunnya ilmu pengetahuan. Semua buku dan alat belajar disembahyangkan sebagai penghormatan kepada Dewi Saraswati.",
    banten_wajib: ["Canang Saraswati", "Banten Pejati", "Canang Sari", "Sesajen Bunga Putih", "Dupa"],
    makna: "Merayakan anugerah pengetahuan dari Dewi Saraswati. Anak-anak membawa buku ke pura untuk disembahyangkan.",
    produk_rekomendasi: ["canang-ceper", "banten-pejati", "canang-sari-harian", "dupa-cendana", "buah-sesajen-komplit"],
    warna: "#2A4D6A",
  },
  {
    id: "saraswati-2026-mar",
    nama: "Hari Raya Saraswati",
    emoji: "📚",
    tanggal: "2026-03-21",
    deskripsi: "Hari turunnya ilmu pengetahuan. Semua buku dan alat belajar disembahyangkan sebagai penghormatan kepada Dewi Saraswati.",
    banten_wajib: ["Canang Saraswati", "Banten Pejati", "Canang Sari", "Sesajen Bunga Putih", "Dupa"],
    makna: "Merayakan anugerah pengetahuan dari Dewi Saraswati. Anak-anak membawa buku ke pura untuk disembahyangkan.",
    produk_rekomendasi: ["canang-ceper", "banten-pejati", "canang-sari-harian", "dupa-cendana", "buah-sesajen-komplit"],
    warna: "#2A4D6A",
  },

  // ========================
  // PAGERWESI (4 hari setelah Saraswati)
  // ========================
  {
    id: "pagerwesi-2025-aug",
    nama: "Hari Raya Pagerwesi",
    emoji: "🛡️",
    tanggal: "2025-08-27",
    deskripsi: "Hari pemujaan Sang Hyang Pramesti Guru. Ritual untuk memperkuat pagar spiritual jiwa dan raga dari pengaruh negatif.",
    banten_wajib: ["Banten Pejati", "Canang Gede", "Canang Sari", "Segehan", "Dupa"],
    makna: "Memperkokoh iman dan kesucian jiwa. 'Pager' berarti pagar, 'Wesi' berarti besi — pagar sekuat besi dari godaan.",
    produk_rekomendasi: ["banten-pejati", "canang-gede", "canang-sari-harian", "segehan-panca-warna", "dupa-harum-pandan"],
    warna: "#5C3D1E",
  },
  {
    id: "pagerwesi-2026-mar",
    nama: "Hari Raya Pagerwesi",
    emoji: "🛡️",
    tanggal: "2026-03-25",
    deskripsi: "Hari pemujaan Sang Hyang Pramesti Guru. Ritual untuk memperkuat pagar spiritual jiwa dan raga dari pengaruh negatif.",
    banten_wajib: ["Banten Pejati", "Canang Gede", "Canang Sari", "Segehan", "Dupa"],
    makna: "Memperkokoh iman dan kesucian jiwa. 'Pager' berarti pagar, 'Wesi' berarti besi — pagar sekuat besi dari godaan.",
    produk_rekomendasi: ["banten-pejati", "canang-gede", "canang-sari-harian", "segehan-panca-warna", "dupa-harum-pandan"],
    warna: "#5C3D1E",
  },

  // ========================
  // TUMPEK LANDEP
  // ========================
  {
    id: "tumpek-landep-2025-aug",
    nama: "Tumpek Landep",
    emoji: "🗡️",
    tanggal: "2025-08-09",
    deskripsi: "Hari pemujaan Sang Hyang Pasupati, penguasa benda-benda tajam dan kendaraan. Semua keris, senjata, dan kendaraan disembahyangkan.",
    banten_wajib: ["Canang Sari", "Banten Pejati", "Sesajen Khusus Logam", "Dupa"],
    makna: "Memohon keselamatan dari benda-benda tajam dan kendaraan. Keris dan alat pertanian disembahyangkan di sanggah.",
    produk_rekomendasi: ["canang-sari-harian", "banten-pejati", "dupa-cendana", "canang-gede"],
    warna: "#9A4F0A",
  },

  // ========================
  // TUMPEK WARIGA / UDUH
  // ========================
  {
    id: "tumpek-wariga-2025-sep",
    nama: "Tumpek Wariga (Uduh)",
    emoji: "🌿",
    tanggal: "2025-09-20",
    deskripsi: "Hari pemujaan tumbuh-tumbuhan. Semua pohon dan tanaman disembahyangkan sebagai rasa syukur kepada alam.",
    banten_wajib: ["Canang Sari", "Sesajen Buah", "Porosan", "Dupa"],
    makna: "Menghormati tumbuhan sebagai sumber kehidupan. Pohon dihias dengan kain dan sesajen sebagai ucapan terima kasih.",
    produk_rekomendasi: ["canang-sari-harian", "buah-sesajen-komplit", "taledan-buah-segar", "dupa-harum-pandan"],
    warna: "#285C42",
  },

  // ========================
  // TUMPEK KUNINGAN
  // ========================
  {
    id: "tumpek-wayang-2025-nov",
    nama: "Tumpek Wayang",
    emoji: "🎭",
    tanggal: "2025-11-01",
    deskripsi: "Hari pemujaan seni pertunjukan, khususnya wayang. Dalang melakukan upacara khusus untuk memohon keselamatan.",
    banten_wajib: ["Canang Sari", "Banten Pejati", "Sesajen Seni", "Dupa Wangi"],
    makna: "Wayang sebagai media penyebaran ajaran Hindu. Dipercaya sebagai hari berbahaya bagi anak-anak yang lahir pada weton tertentu.",
    produk_rekomendasi: ["canang-sari-harian", "banten-pejati", "dupa-cendana", "canang-gede"],
    warna: "#8B3A62",
  },

  // ========================
  // PURNAMA BULANAN (beberapa contoh)
  // ========================
  {
    id: "purnama-2025-jul",
    nama: "Purnama Kasa",
    emoji: "🌕",
    tanggal: "2025-07-10",
    deskripsi: "Hari bulan purnama, hari suci bersembahyang ke pura. Dilakukan setiap bulan pada saat bulan penuh.",
    banten_wajib: ["Canang Sari", "Dupa", "Canang Gede", "Pejati Alit"],
    makna: "Bulan purnama adalah waktu terbaik untuk sembahyang. Energi spiritual dipercaya sangat kuat pada malam purnama.",
    produk_rekomendasi: ["canang-sari-harian", "dupa-harum-pandan", "canang-gede", "banten-pejati"],
    warna: "#D4A820",
  },
  {
    id: "purnama-2025-aug",
    nama: "Purnama Karo",
    emoji: "🌕",
    tanggal: "2025-08-09",
    deskripsi: "Hari bulan purnama, hari suci bersembahyang ke pura. Dilakukan setiap bulan pada saat bulan penuh.",
    banten_wajib: ["Canang Sari", "Dupa", "Canang Gede", "Pejati Alit"],
    makna: "Bulan purnama adalah waktu terbaik untuk sembahyang. Energi spiritual dipercaya sangat kuat pada malam purnama.",
    produk_rekomendasi: ["canang-sari-harian", "dupa-harum-pandan", "canang-gede", "banten-pejati"],
    warna: "#D4A820",
  },
  {
    id: "purnama-2025-sep",
    nama: "Purnama Katiga",
    emoji: "🌕",
    tanggal: "2025-09-07",
    deskripsi: "Hari bulan purnama, hari suci bersembahyang ke pura. Dilakukan setiap bulan pada saat bulan penuh.",
    banten_wajib: ["Canang Sari", "Dupa", "Canang Gede", "Pejati Alit"],
    makna: "Bulan purnama adalah waktu terbaik untuk sembahyang. Energi spiritual dipercaya sangat kuat pada malam purnama.",
    produk_rekomendasi: ["canang-sari-harian", "dupa-harum-pandan", "canang-gede", "banten-pejati"],
    warna: "#D4A820",
  },
  {
    id: "purnama-2025-oct",
    nama: "Purnama Kapat",
    emoji: "🌕",
    tanggal: "2025-10-07",
    deskripsi: "Hari bulan purnama, hari suci bersembahyang ke pura.",
    banten_wajib: ["Canang Sari", "Dupa", "Canang Gede", "Pejati Alit"],
    makna: "Bulan purnama adalah waktu terbaik untuk sembahyang dan memohon berkah.",
    produk_rekomendasi: ["canang-sari-harian", "dupa-harum-pandan", "canang-gede", "banten-pejati"],
    warna: "#D4A820",
  },
  {
    id: "purnama-2025-nov",
    nama: "Purnama Kalima",
    emoji: "🌕",
    tanggal: "2025-11-05",
    deskripsi: "Hari bulan purnama, hari suci bersembahyang ke pura.",
    banten_wajib: ["Canang Sari", "Dupa", "Canang Gede", "Pejati Alit"],
    makna: "Bulan purnama adalah waktu terbaik untuk sembahyang dan memohon berkah.",
    produk_rekomendasi: ["canang-sari-harian", "dupa-harum-pandan", "canang-gede", "banten-pejati"],
    warna: "#D4A820",
  },
  {
    id: "purnama-2025-dec",
    nama: "Purnama Kanem",
    emoji: "🌕",
    tanggal: "2025-12-04",
    deskripsi: "Hari bulan purnama, hari suci bersembahyang ke pura.",
    banten_wajib: ["Canang Sari", "Dupa", "Canang Gede", "Pejati Alit"],
    makna: "Bulan purnama adalah waktu terbaik untuk sembahyang dan memohon berkah.",
    produk_rekomendasi: ["canang-sari-harian", "dupa-harum-pandan", "canang-gede", "banten-pejati"],
    warna: "#D4A820",
  },
  {
    id: "purnama-2026-jan",
    nama: "Purnama Kapitu",
    emoji: "🌕",
    tanggal: "2026-01-03",
    deskripsi: "Hari bulan purnama, hari suci bersembahyang ke pura.",
    banten_wajib: ["Canang Sari", "Dupa", "Canang Gede", "Pejati Alit"],
    makna: "Bulan purnama adalah waktu terbaik untuk sembahyang dan memohon berkah.",
    produk_rekomendasi: ["canang-sari-harian", "dupa-harum-pandan", "canang-gede", "banten-pejati"],
    warna: "#D4A820",
  },

  // ========================
  // TILEM BULANAN
  // ========================
  {
    id: "tilem-2025-jul",
    nama: "Tilem Kasa",
    emoji: "🌑",
    tanggal: "2025-07-25",
    deskripsi: "Hari bulan mati (tilem), sama sucinya dengan purnama. Waktu untuk introspeksi dan membersihkan diri.",
    banten_wajib: ["Canang Sari", "Segehan", "Dupa", "Canang Ceper"],
    makna: "Tilem adalah momen refleksi diri. Dipercaya sebagai waktu energi negatif perlu dinetralisir dengan doa.",
    produk_rekomendasi: ["canang-sari-harian", "segehan-panca-warna", "dupa-harum-pandan", "canang-ceper"],
    warna: "#3D2010",
  },
  {
    id: "tilem-2025-aug",
    nama: "Tilem Karo",
    emoji: "🌑",
    tanggal: "2025-08-23",
    deskripsi: "Hari bulan mati (tilem), sama sucinya dengan purnama. Waktu untuk introspeksi dan membersihkan diri.",
    banten_wajib: ["Canang Sari", "Segehan", "Dupa", "Canang Ceper"],
    makna: "Tilem adalah momen refleksi diri. Dipercaya sebagai waktu energi negatif perlu dinetralisir dengan doa.",
    produk_rekomendasi: ["canang-sari-harian", "segehan-panca-warna", "dupa-harum-pandan", "canang-ceper"],
    warna: "#3D2010",
  },
  {
    id: "tilem-2025-sep",
    nama: "Tilem Katiga",
    emoji: "🌑",
    tanggal: "2025-09-21",
    deskripsi: "Hari bulan mati (tilem), sama sucinya dengan purnama. Waktu untuk introspeksi.",
    banten_wajib: ["Canang Sari", "Segehan", "Dupa", "Canang Ceper"],
    makna: "Waktu energi negatif perlu dinetralisir dengan doa dan persembahan tulus.",
    produk_rekomendasi: ["canang-sari-harian", "segehan-panca-warna", "dupa-harum-pandan", "canang-ceper"],
    warna: "#3D2010",
  },
  {
    id: "tilem-2025-oct",
    nama: "Tilem Kapat",
    emoji: "🌑",
    tanggal: "2025-10-21",
    deskripsi: "Hari bulan mati (tilem), sama sucinya dengan purnama. Waktu untuk introspeksi.",
    banten_wajib: ["Canang Sari", "Segehan", "Dupa", "Canang Ceper"],
    makna: "Waktu energi negatif perlu dinetralisir dengan doa dan persembahan tulus.",
    produk_rekomendasi: ["canang-sari-harian", "segehan-panca-warna", "dupa-harum-pandan", "canang-ceper"],
    warna: "#3D2010",
  },
];

/**
 * Mencari hari raya terdekat dalam rentang N hari ke depan
 */
export function getUpcomingHariRaya(daysAhead = 14): HariRaya | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const limit = new Date(today);
  limit.setDate(today.getDate() + daysAhead);

  const upcoming = kalenderHariRaya
    .filter((hr) => {
      const d = new Date(hr.tanggal);
      return d >= today && d <= limit;
    })
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  return upcoming[0] || null;
}

/**
 * Hitung jumlah hari tersisa hingga hari raya
 */
export function getDaysUntil(tanggal: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(tanggal);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Format tanggal ke Bahasa Indonesia
 */
export function formatTanggalIndo(tanggal: string): string {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
