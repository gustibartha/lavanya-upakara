// ==========================================
// Mengisi tiga artikel edukasi awal
// ==========================================
// Beda dari src/db/seed.ts: skrip ini TIDAK menghapus apa pun. Aman
// dijalankan berkali-kali — artikel yang slug-nya sudah ada dilewati,
// bukan diduplikasi.
//
// Jalankan dengan: npm run db:seed-articles

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import * as schema from "./schema";

dotenv.config({ path: ".env.local" });

interface ArtikelAwal {
  slug: string;
  judul: string;
  ringkasan: string;
  konten: string[];
  kategori: string;
  gambar: string;
}

const artikelAwal: ArtikelAwal[] = [
  {
    slug: "memahami-makna-banten-pejati",
    judul: "Memahami Makna Banten Pejati dalam Upacara",
    ringkasan:
      "Banten Pejati merupakan salah satu sarana upacara dasar yang wajib ada dalam berbagai ritual Hindu di Bali. Mari kenali komponennya.",
    kategori: "Edukasi",
    gambar: "/images/categories/sesajen.png",
    konten: [
      "Bagi umat Hindu di Bali, Banten Pejati bukan sekadar sesajen biasa. Ia sering disebut sebagai \"identitas\" dari sebuah upacara — persembahan pembuka yang menandakan bahwa sebuah ritual, sekecil apa pun, sedang atau akan dilaksanakan dengan sungguh-sungguh.",
      "Secara umum, Banten Pejati terdiri dari beberapa tingkatan yang disusun dalam wadah bertingkat, biasanya dari bambu atau dulang. Di dalamnya terdapat buah-buahan, jajan tradisional, canang, dupa, air suci, benang tridatu, dan uang kepeng. Setiap unsur punya tempatnya sendiri, disusun dengan rapi sebagai bentuk penghormatan.",
      "Fungsi utamanya adalah sebagai permohonan izin dan pemberitahuan kepada Ida Sang Hyang Widhi Wasa serta para dewata, bahwa sebuah upacara akan dilangsungkan. Karena itu, Banten Pejati hampir selalu dipersembahkan di awal ritual — sebelum banten-banten lain yang lebih spesifik untuk acara tertentu.",
      "Banten Pejati dipakai dalam hampir semua jenis upacara: potong gigi, pernikahan, ngaben, piodalan di pura, hingga upacara kecil di rumah. Ukuran dan kelengkapannya bisa disesuaikan dengan skala acara — yang sederhana untuk sembahyang harian, yang lebih lengkap untuk upacara besar.",
      "Lebih dari sekadar kelengkapan ritual, Banten Pejati mengajarkan tentang kesungguhan dan rasa syukur. Ia adalah cara umat menyampaikan bahwa apa pun yang akan dilakukan, dilakukan dengan permohonan restu terlebih dahulu — sebuah nilai yang relevan jauh di luar konteks upacara itu sendiri.",
    ],
  },
  {
    slug: "persiapan-menyambut-hari-raya-galungan",
    judul: "Persiapan Menyambut Hari Raya Galungan",
    ringkasan:
      "Hari kemenangan Dharma melawan Adharma sebentar lagi tiba. Apa saja perlengkapan yang perlu Anda persiapkan dari sekarang?",
    kategori: "Hari Raya",
    gambar: "/images/products/sesajen-galungan.png",
    konten: [
      "Galungan adalah salah satu hari raya terpenting bagi umat Hindu di Bali — hari kemenangan Dharma (kebaikan) atas Adharma (kejahatan), dirayakan setiap 210 hari sekali menurut kalender Pawukon. Sepuluh hari setelahnya, umat kembali merayakan Kuningan sebagai penutup rangkaian perayaan.",
      "Persiapan biasanya dimulai beberapa hari sebelum hari-H. Ada Penampahan Galungan, hari saat keluarga menyiapkan lauk khas seperti lawar, dan memasang Penjor — bambu melengkung yang dihias janur, buah, dan hasil bumi — di depan rumah sebagai simbol rasa syukur atas kemakmuran.",
      "Sarana upacara yang umum disiapkan meliputi Penjor, Canang Gede, Banten Pejati, Canang Sari harian, serta dupa dan buah-buahan segar untuk gebogan. Karena permintaan biasanya melonjak menjelang hari raya, banyak keluarga memilih memesan lebih awal supaya tidak kehabisan.",
      "Galungan juga menjadi momen berkumpul keluarga besar. Umat mengunjungi pura, bersembahyang bersama, dan saling mengunjungi sanak saudara — mirip semangat silaturahmi pada hari raya keagamaan lainnya.",
      "Di balik seluruh persiapan fisiknya, Galungan pada dasarnya adalah pengingat batin: kemenangan kebaikan yang paling utama adalah kemenangan atas diri sendiri. Penjor yang berdiri megah di depan rumah menjadi simbol gunung, alam semesta, sekaligus pengingat untuk terus menjaga keseimbangan antara manusia, alam, dan Sang Pencipta.",
    ],
  },
  {
    slug: "filosofi-dupa-lebih-dari-sekadar-pengharum",
    judul: "Filosofi Dupa: Lebih dari Sekadar Pengharum",
    ringkasan:
      "Asap dupa melambangkan doa umat yang membubung ke hadapan Ida Sang Hyang Widhi Wasa. Ketahui jenis dupa terbaik untuk sembahyang.",
    kategori: "Tradisi",
    gambar: "/images/products/dupa-harum-pandan.png",
    konten: [
      "Hampir tidak ada persembahyangan Hindu Bali yang berlangsung tanpa dupa. Aromanya yang khas sering dianggap sekadar pelengkap suasana — padahal maknanya jauh lebih dalam dari itu.",
      "Asap dupa yang membubung ke atas dimaknai sebagai simbol doa umat yang naik menuju hadapan Ida Sang Hyang Widhi Wasa. Ia menjadi penghubung antara dunia manusia (sekala) dengan yang tidak terlihat (niskala) — perantara yang membawa harapan dan permohonan umat ke alam yang lebih tinggi.",
      "Selain itu, wangi dupa dipercaya membantu menciptakan suasana khusyuk dan tenang, sekaligus dianggap membersihkan area persembahyangan secara niskala dari pengaruh-pengaruh negatif sebelum ritual dimulai.",
      "Di pasaran, tersedia berbagai jenis dupa dengan aroma berbeda — cendana, pandan, kenanga, dan masih banyak lagi. Pemilihannya sering mengikuti kebiasaan keluarga, jenis upacara, atau sekadar ketersediaan di daerah masing-masing, bukan aturan yang kaku dan seragam untuk semua orang.",
      "Cara memegang dupa saat sembahyang — biasanya dijepit di antara jari lalu diangkat sebatas dahi — juga sarat makna simbolis, sebagai penghubung antara diri yang bersembahyang dengan Yang Maha Kuasa. Sebuah gerakan sederhana yang membawa makna panjang di baliknya.",
    ],
  },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL tidak ditemukan.");
    process.exit(1);
  }

  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client, { schema });

  try {
    let dibuat = 0;
    let dilewati = 0;

    for (const a of artikelAwal) {
      const existing = await db.query.articles.findFirst({
        where: eq(schema.articles.slug, a.slug),
      });

      if (existing) {
        console.log(`⏭️  Dilewati (sudah ada): ${a.slug}`);
        dilewati++;
        continue;
      }

      await db.insert(schema.articles).values({
        id: `art-${randomUUID().slice(0, 8)}`,
        slug: a.slug,
        judul: a.judul,
        ringkasan: a.ringkasan,
        konten: JSON.stringify(a.konten),
        kategori: a.kategori,
        gambar: a.gambar,
        aktif: true,
      });
      console.log(`✅ Dibuat: ${a.slug}`);
      dibuat++;
    }

    console.log(`\nSelesai. ${dibuat} artikel dibuat, ${dilewati} dilewati.`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Gagal:", err);
  process.exit(1);
});
