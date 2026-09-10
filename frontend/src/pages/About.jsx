import React from "react";
import Features from "../components/Features.jsx";
import Strip from "../components/Strip.jsx";

export default function About() {
  return (
    <main className="inner-page">
      <section className="about-intro wrap">
        <div className="eyebrow">TENTANG DPS SPORT</div>
        <h1>Partner Performa<br /><span>Terbaik Anda</span></h1>
        <p>
          Dps Sport adalah toko spesialis airgun dan sparepart yang menyediakan
          produk berkualitas untuk kebutuhan olahraga menembak. Kami membantu
          Anda memilih perlengkapan yang tepat dengan layanan yang cepat dan
          informatif.
        </p>
        <a
          className="btn btn-outline about-location"
          href="https://maps.app.goo.gl/rf8imMpob4Mic1sK8"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          Lihat Lokasi Toko <span aria-hidden="true">↗</span>
        </a>
      </section>
      <Features />
      <Strip />
    </main>
  );
}
