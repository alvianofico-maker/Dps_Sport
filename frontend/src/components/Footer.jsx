import React from "react";
import { Link } from "react-router-dom";
import { waHref } from "../api.js";

export default function Footer({ settings }) {
  const whatsapp = settings?.whatsapp || "6282178496326";
  const whatsappHref = waHref(
    whatsapp,
    "Halo Dps Sport, saya ingin bertanya-tanya tentang produk airgun."
  );
  const youtube = settings?.youtube || "https://www.youtube.com/@DwiPrast177";

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand">
              <div className="brand-mark"><span></span></div>
              <div>
                <div className="brand-name">Dps Sport</div>
                <div className="brand-sub">AIRGUN &amp; SPAREPART SPECIALIST</div>
              </div>
            </div>
            <p>
              Toko senapan angin dan sparepart terlengkap dengan kualitas
              terbaik untuk mendukung performa terbaik Anda.
            </p>
          </div>
          <div>
            <h4>Menu</h4>
            <ul>
              <li><Link to="/">Beranda</Link></li>
              <li><Link to="/produk">Produk</Link></li>
              <li><Link to="/tentang">Tentang Kami</Link></li>
              <li><Link to="/kontak">Kontak</Link></li>
            </ul>
          </div>
          <div id="kontak">
            <h4>Hubungi Kami</h4>
            <a className="contact-line" href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <span className="contact-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1s-.7.9-.9 1.1-.4.2-.6.1c-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3z" />
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5.1-1.3c1.5.8 3.2 1.3 4.9 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-3.2.8.9-3.1-.2-.3C3.9 14.6 3.5 13.3 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z" />
                </svg>
              </span>
              {settings?.phone || "0821-7849-6326"}
            </a>
          </div>
          <div>
            <h4>Ikuti Kami</h4>
            <div className="socials">
              <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#FF0000" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8z" />
                  <path fill="#FFFFFF" d="m9.6 15.6 6.3-3.6-6.3-3.6v7.2Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2024 Dps Sport. All Rights Reserved.</span>
              <Link to="/admin" className="admin-link">Admin ↗</Link>
        </div>
      </div>
    </footer>
  );
}
