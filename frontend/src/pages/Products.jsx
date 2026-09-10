import React from "react";
import ProductGrid from "../components/ProductGrid.jsx";

export default function Products({ settings }) {
  return (
    <main className="inner-page">
      <div className="page-heading wrap">
        <div className="eyebrow">DPS SPORT</div>
        <h1>Produk Kami</h1>
        <p>Temukan senapan angin, sparepart, aksesoris, dan perlengkapan sesuai kebutuhan Anda.</p>
      </div>
      <ProductGrid settings={settings} />
    </main>
  );
}
