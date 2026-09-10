import React from "react";

const FEATURES = [
  {
    title: "SENAPAN ANGIN",
    desc: "Berbagai pilihan senapan berkualitas tinggi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        <path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4" />
      </svg>
    ),
  },
  {
    title: "SPAREPART",
    desc: "Komponen original & berkualitas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a4 4 0 01-5.4 5.4l-5.6 5.6a1.5 1.5 0 002.1 2.1l5.6-5.6a4 4 0 015.4-5.4l-2.6 2.6-2.1-2.1 2.6-2.6z" />
      </svg>
    ),
  },
  {
    title: "AKSESORIS",
    desc: "Aksesoris pendukung untuk performa optimal",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6.5" y="2.5" width="4" height="8" rx="1.6" />
        <path d="M8.5 10.5v11" />
        <rect x="13.5" y="2.5" width="4" height="8" rx="1.6" />
        <path d="M15.5 10.5v11" />
      </svg>
    ),
  },
  {
    title: "PERLENGKAPAN",
    desc: "Perlengkapan menembak yang lengkap",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3l3-3 2.1 2.1-3 3M9.3 11.7l-6 6a2 2 0 002.9 2.9l6-6" />
        <path d="M14.7 6.3a4 4 0 105.4 5.4L9.3 11.7 6.4 8.8l2.9-2.9a4 4 0 015.4.4z" />
      </svg>
    ),
  },
  {
    title: "MAINTENANCE",
    desc: "Perawatan senapan agar selalu prima",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="2.5" width="8" height="5" rx="1.2" />
        <path d="M9 7.5v6.5a3 3 0 106 0V7.5" />
        <path d="M12 14v7.5" />
      </svg>
    ),
  },
  {
    title: "KUALITAS TERJAMIN",
    desc: "Produk teruji dengan kualitas terbaik",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5l7.5 3v5.7c0 4.9-3.2 8.9-7.5 10.3-4.3-1.4-7.5-5.4-7.5-10.3V5.5z" />
        <path d="M9 12l2.2 2.2L15.5 10" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section className="features">
      <div className="wrap features-grid">
        {FEATURES.map((f, i) => (
          <div className="feature-item fade-up" style={{ animationDelay: `${i * 0.05}s` }} key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
