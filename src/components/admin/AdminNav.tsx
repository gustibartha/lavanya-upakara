"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/produk", label: "Produk" },
];

export function AdminNav({ namaAdmin }: { namaAdmin: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="admin-nav">
      <div className="admin-nav-brand">
        Lavanya<span>Upakara</span>
        <span className="admin-nav-tag">Admin</span>
      </div>
      <nav className="admin-nav-links">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="admin-nav-user">
        <span>{namaAdmin}</span>
        <button type="button" onClick={handleLogout} className="admin-logout-btn">
          Keluar
        </button>
      </div>
    </header>
  );
}
