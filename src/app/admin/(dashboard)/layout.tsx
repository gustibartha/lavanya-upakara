import { requireAdmin } from "@/lib/admin/guard";
import { AdminNav } from "@/components/admin/AdminNav";

// Grup route (dashboard) ini yang dijaga — /admin/login ada di luar grup
// ini (folder saudara, bukan di dalamnya), jadi halaman login tidak ikut
// terkena redirect dari requireAdmin().
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="admin-shell">
      <AdminNav namaAdmin={admin.nama} />
      <main className="admin-content">{children}</main>
    </div>
  );
}
