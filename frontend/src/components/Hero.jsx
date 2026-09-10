import React from "react";
import { waHref } from "../api.js";

export default function Hero({ settings }) {
  const wa = waHref(
    settings?.whatsapp || "6282178496326",
    "Halo Dps Sport, saya ingin bertanya-tanya tentang produk airgun."
  );

  return (
    <section className="hero hero-banner">
      <div className="wrap">
        <div className="hero-full fade-up">
          <div className="hero-art">
            <img src="/images/tumbnail.png" alt="Dps Sport - Katalog Senapan" className="hero-full-img" />
            <img src="/images/tumbnail-mobile.png" alt="Dps Sport - Katalog Senapan" className="hero-mobile-img" />
            <div className="hero-mobile-code" aria-hidden="true">
              <div className="hero-mobile-kicker">DPS SPORT</div>
              <div className="hero-mobile-title">AIRGUN<br /><span>SPECIALIST</span></div>
              <svg viewBox="0 0 520 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M92 130h265l74 20H92c-18 0-27-7-27-10s9-10 27-10Z" fill="currentColor" opacity=".92" />
                <path d="M338 130 408 66l16 8-57 56" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
                <path d="m377 116 25 43-18 8-30-40" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
                <path d="M111 130 71 89" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                <path d="M65 88 48 72" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                <circle cx="278" cy="141" r="9" fill="#0a0e0c" />
                <path d="M248 143c-6 29-1 44 16 51h46c-16-17-22-33-17-51" fill="#0a0e0c" />
              </svg>
              <div className="hero-mobile-cta">TANYA VIA WHATSAPP</div>
            </div>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-wa-overlay"
              aria-label="Tanya via WhatsApp"
            ></a>
          </div>
        </div>
      </div>
    </section>
  );
}
