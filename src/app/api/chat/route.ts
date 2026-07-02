import { google } from "@ai-sdk/google";
import { streamText, CoreMessage } from "ai";
import { products } from "@/lib/data";

// Set max duration for Vercel Edge/Serverless functions
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Format product catalog into a string for the AI context
    const productCatalog = products
      .map(p => `- [PROD:${p.slug}] ${p.nama_produk} (Rp ${p.harga.toLocaleString('id-ID')})`)
      .join("\n");

    const systemPrompt = `Kamu adalah Asisten Lavanya, customer service digital untuk Lavanya Upakara (platform khusus perlengkapan sembahyang Hindu Bali).
Gaya bicaramu ramah, sopan, sedikit kasual tapi profesional. Selalu sapa pengguna dengan "Om Swastyastu 🙏" pada sapaan awal.

Katalog Produk yang tersedia:
${productCatalog}

TUGASMU:
1. Bantu pengguna mencari produk yang tepat untuk upacara, hari raya, atau keperluan sembahyang mereka.
2. JIKA pengguna bertanya atau ingin membeli, rekomendasikan produk dari daftar katalog di atas yang relevan.
3. KETIKA kamu merekomendasikan produk, kamu WAJIB mencantumkan kode rahasia produk di dalam balasanmu dengan format: [PROD:slug-produk-nya] agar sistem kami bisa menampilkan gambar dan harga secara interaktif.
Contoh: "Untuk keperluan tersebut, tiang rekomendasikan [PROD:daksina-lengkap] ya."

Aturan Penting:
- JANGAN mengarang produk yang tidak ada di katalog.
- Pahami bahasa Indonesia dan istilah-istilah Hindu Bali (misal: canang, daksina, pejati, kuningan, galungan, purnama, tilem).
- Jawab secara ringkas dan hangat.`;

    // Stream the text directly from the Gemini API
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: messages as CoreMessage[],
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
