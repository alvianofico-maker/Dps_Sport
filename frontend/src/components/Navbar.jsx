import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ICONS = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <path d="M16 8.3a3 3 0 010 5.9" />
      <path d="M20.5 20c0-2.7-1.7-4.6-4-5.3" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h4l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v4a2 2 0 01-2.2 2A17 17 0 014 6.2 2 2 0 014 4z" />
    </svg>
  ),
};

export default function Navbar({ settings }) {
  const [open, setOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const hideTimer = useRef(null);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const showNavbar = () => {
      setIsHidden(false);
      window.clearTimeout(hideTimer.current);

      if (window.scrollY > 0) {
        hideTimer.current = window.setTimeout(() => setIsHidden(true), 2500);
      }
    };

    showNavbar();
    window.addEventListener("scroll", showNavbar, { passive: true });

    return () => {
      window.removeEventListener("scroll", showNavbar);
      window.clearTimeout(hideTimer.current);
    };
  }, []);

  const NAV_ITEMS = [
    { to: "/", label: "Beranda", icon: "home" },
    { to: "/produk", label: "Produk", icon: "box" },
    { to: "/tentang", label: "Tentang Kami", icon: "users" },
    { to: "/kontak", label: "Kontak", icon: "phone" },
  ];

  const handleNavigation = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header className={`site-header${isHidden ? " is-hidden" : ""}`}>
      <nav className="nav">
        <Link to="/" className="brand" onClick={handleNavigation}>
          <div className="brand-mark"><span></span></div>
          <div>
            <div className="brand-name">Dps Sport</div>
            <div className="brand-sub">AIRGUN &amp; SPAREPART SPECIALIST</div>
          </div>
        </Link>

        <div className="nav-links-wrap">
          <ul className="nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={isActive(item.to) ? "active" : ""} onClick={handleNavigation}>
                  {ICONS[item.icon]}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <button className="burger" onClick={() => setOpen((o) => !o)}>☰</button>

        <div className={`mobile-menu ${open ? "open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} onClick={handleNavigation}>{item.label}</Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
