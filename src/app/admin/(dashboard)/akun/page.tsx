import { requireAdmin } from "@/lib/admin/guard";
import { GantiSandiForm } from "@/components/admin/GantiSandiForm";

export default async function AdminAkunPage() {
  const admin = await requireAdmin();

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Akun Saya</h1>
      <p className="admin-page-sub">
        Masuk sebagai <strong>{admin.nama}</strong> ({admin.email}).
      </p>
      <GantiSandiForm />
    </div>
  );
}
