"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = authClient.useSession();
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "G";
  const userName = session?.user?.name || "Guest";

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
      <div className="container nav-inner">
        <Link href="/" className="nav-logo">
          Lavanya<span>Upakara</span>
        </Link>

        <div className="nav-links">
          <Link href="/">Beranda</Link>
          <Link href="/katalog">Katalog</Link>
          <Link href="/toko">Toko</Link>
          <Link href="/mitra">Daftar Mitra</Link>
        </div>

        <div className="nav-actions">
          <button className="nav-cart-btn" onClick={() => setIsCartOpen(true)}>
            <span>🛍️</span>
            {cartCount > 0 && (
              <span className="cart-badge" id="cartBadge">
                {cartCount}
              </span>
            )}
          </button>

          {isPending ? (
            <div className="nav-user-btn">
              <div className="nav-avatar nav-avatar-loading">...</div>
            </div>
          ) : session?.user ? (
            /* Logged in — dropdown */
            <div className="nav-user-dropdown" ref={dropdownRef}>
              <button
                className="nav-user-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="nav-avatar nav-avatar-active">
                  {userInitial}
                </div>
                <span className="nav-avatar-name">{userName}</span>
              </button>

              {dropdownOpen && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <div className="nav-dropdown-avatar">{userInitial}</div>
                    <div>
                      <div className="nav-dropdown-name">{userName}</div>
                      <div className="nav-dropdown-email">{session.user.email}</div>
                    </div>
                  </div>
                  <div className="nav-dropdown-divider" />
                  <Link href="/riwayat" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    📜 Riwayat Pesanan
                  </Link>
                  <Link href="/profil" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    👤 Profil Saya
                  </Link>
                  <button className="nav-dropdown-item" onClick={handleSignOut}>
                    🚪 Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in */
            <div className="nav-auth-buttons">
              <Link href="/masuk" className="nav-login-btn">
                Masuk
              </Link>
              <Link href="/daftar" className="nav-register-btn">
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
