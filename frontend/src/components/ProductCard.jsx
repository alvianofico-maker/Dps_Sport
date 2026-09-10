import React from "react";
import { formatRp, waHref } from "../api.js";

function GunIcon() {
  return (
    <svg viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeWidth="1.3" opacity="0.9">
        <rect x="14" y="38" width="90" height="9" rx="2" />
        <rect x="104" y="32" width="34" height="20" rx="3" />
        <path d="M138 36 h48 v6 h-48z" />
        <circle cx="176" cy="39" r="9" />
        <circle cx="176" cy="39" r="5" />
        <rect x="30" y="47" width="9" height="22" rx="1.5" />
        <path d="M30 69 l-4 14 h17 l-2 -14z" />
      </g>
    </svg>
  );
}

export default function ProductCard({ product, settings, index = 0 }) {
  const wa = waHref(
    settings?.whatsapp || "6282178496326",
    `Halo Dps Sport, saya tertarik dengan produk ${product.name} seharga ${formatRp(
      product.price
    )}. Apakah masih tersedia?`
  );

  return (
    <div className="card fade-up" style={{ animationDelay: `${(index % 6) * 0.05}s` }}>
      {product.discount && <span className="badge">Diskon</span>}
      <div className="card-img">
        {product.image ? <img src={product.image} alt={product.name} /> : <GunIcon />}
      </div>
      <div className="card-body">
        <h3>{product.name}</h3>
        <div className="specs">
          <span>🎯 Kaliber {product.caliber}</span>
          <span>📏 Panjang {product.length}</span>
          <span>⚖️ Berat {product.weight}</span>
        </div>
        <div className="price-row">
          {product.discount && <span className="price-old">{formatRp(product.priceOld)}</span>}
          <span className="price-new">{formatRp(product.price)}</span>
        </div>
        <div className="card-actions">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm btn-block">
            Tanya via WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
