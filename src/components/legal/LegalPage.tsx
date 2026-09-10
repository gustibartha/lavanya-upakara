import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

interface Props {
  judul: string;
  ringkasan: string;
  terakhirDiperbarui: string;
  children: React.ReactNode;
}

/** Kerangka halaman dokumen — dipakai Syarat & Ketentuan dan Kebijakan Privasi. */
export function LegalPage({ judul, ringkasan, terakhirDiperbarui, children }: Props) {
  return (
    <>
      <Navbar />
      <main className="legal-page">
        <div className="container legal-container">
          <header className="legal-header">
            <h1 className="legal-title">{judul}</h1>
            <p className="legal-lead">{ringkasan}</p>
            <p className="legal-updated">
              Terakhir diperbarui: {terakhirDiperbarui}
            </p>
          </header>
          <article className="legal-body">{children}</article>
        </div>
      </main>
      <Footer />
    </>
  );
}
