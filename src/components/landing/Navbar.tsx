"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import { getUpcomingHariRaya, getDaysUntil } from "@/lib/hari-raya";
import { Bell, Menu, X, Loader2, User } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasHariRaya, setHasHariRaya] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = authClient.useSession();
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const upcoming = getUpcomingHariRaya(7);
    setHasHariRaya(!!upcoming);
  }, []);

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
    <>
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
          {hasHariRaya && (
            <button
              className="nav-notif-btn"
              title="Ada hari raya yang mendekat!"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            >
              <Bell size={17} />
              <span className="nav-notif-dot" />
            </button>
          )}
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
              <div className="nav-avatar nav-avatar-loading">
                <Loader2 size={16} className="animate-spin" />
              </div>
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

          {/* Mobile Menu Toggle */}
          <button className="nav-mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="nav-logo">Lavanya<span>Upakara</span></span>
              <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="mobile-menu-links">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>Beranda</Link>
              <Link href="/katalog" onClick={() => setMobileMenuOpen(false)}>Katalog</Link>
              <Link href="/toko" onClick={() => setMobileMenuOpen(false)}>Toko</Link>
              <Link href="/mitra" onClick={() => setMobileMenuOpen(false)}>Daftar Mitra</Link>
            </div>
            
            <div className="mobile-menu-divider" />
            
            {session?.user ? (
              <div className="mobile-menu-user">
                <div className="mobile-menu-user-info">
                  <div className="nav-avatar nav-avatar-active">{userInitial}</div>
                  <div>
                    <div className="mobile-menu-name">{userName}</div>
                    <div className="mobile-menu-email">{session.user.email}</div>
                  </div>
                </div>
                <Link href="/riwayat" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                  📜 Riwayat Pesanan
                </Link>
                <Link href="/profil" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                  👤 Profil Saya
                </Link>
                <button className="mobile-menu-link text-danger" onClick={handleSignOut}>
                  🚪 Keluar
                </button>
              </div>
            ) : (
              <div className="mobile-menu-auth">
                <Link href="/masuk" className="btn btn-outline w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                  Masuk
                </Link>
                <Link href="/daftar" className="btn btn-primary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
