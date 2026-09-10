import React from "react";

const ITEMS = [
  {
    title: "PENGIRIMAN AMAN",
    desc: "Pengiriman cepat dan aman ke seluruh Indonesia",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1.5" y="7" width="12" height="9" rx="1" />
        <path d="M13.5 10h4l3.5 3.5V16h-7.5z" />
        <circle cx="6" cy="18.5" r="1.6" />
        <circle cx="17" cy="18.5" r="1.6" />
      </svg>
    ),
  },
  {
    title: "KUALITAS TERJAMIN",
    desc: "Produk original dan berkualitas terbaik",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5l7.5 3v5.7c0 4.9-3.2 8.9-7.5 10.3-4.3-1.4-7.5-5.4-7.5-10.3V5.5z" />
        <path d="M9 12l2.2 2.2L15.5 10" />
      </svg>
    ),
  },
  {
    title: "LAYANAN CEPAT",
    desc: "Respon cepat via WhatsApp siap membantu Anda",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 13a8 8 0 0116 0v4a2 2 0 01-2 2h-1v-7h3" />
        <path d="M4 13v6h3v-7H4z" />
        <path d="M9 20.5h4a1.5 1.5 0 000-3H9" />
      </svg>
    ),
  },
  {
    title: "PACKING AMAN",
    desc: "Kemasan rapi dan aman sampai tujuan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8l-9-5-9 5 9 5 9-5z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </svg>
    ),
  },
];

export default function Strip() {
  return (
    <section className="strip">
      <div className="wrap strip-grid">
        {ITEMS.map((it, i) => (
          <div className="strip-item fade-up" style={{ animationDelay: `${i * 0.05}s` }} key={it.title}>
            <div className="strip-icon">{it.icon}</div>
            <div>
              <h4>{it.title}</h4>
              <p>{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
