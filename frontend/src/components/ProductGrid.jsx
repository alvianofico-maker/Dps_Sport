import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ settings, featured = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    api
      .getProducts()
      .then((data) => {
        if (!ignore) setProducts(data);
      })
      .catch((e) => !ignore && setError(e.message))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matchingProducts = products.filter((p) => p.name.toLowerCase().includes(term));

    if (!featured) return matchingProducts;

    return matchingProducts.filter((p) => p.featured).slice(0, 8);
  }, [products, search, featured]);

  return (
    <section className="products" id="produk">
      <div className="wrap">
        <div className="products-head">
          <div>
            <div className="eyebrow">{featured ? "PRODUK PILIHAN" : "SEMUA PRODUK"}</div>
            <h2>{featured ? "Produk Terlaris" : "Koleksi Produk"}</h2>
          </div>
          {!featured && (
            <button className="btn btn-outline btn-sm" onClick={() => setSearch("")}>
              Reset Pencarian <span aria-hidden="true">↺</span>
            </button>
          )}
        </div>

        {!featured && (
          <div className="toolbar">
            <div className="search-box">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Cari produk, mis. Predator, Bullpup..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="grid">
          {loading && <div className="loading-state">Memuat produk...</div>}
          {!loading && error && <div className="empty-state">{error}. Pastikan backend sudah berjalan.</div>}
          {!loading && !error && filtered.length === 0 && (
            <div className="empty-state">Produk tidak ditemukan. Coba kata kunci lain.</div>
          )}
          {!loading &&
            !error &&
            filtered.map((p, i) => (
              <ProductCard product={p} settings={settings} index={i} key={p.id} />
            ))}
        </div>

        <div className="view-all-wrap">
          {featured ? (
            <Link className="btn btn-outline" to="/produk">
              Lihat Lebih Banyak <span aria-hidden="true">↗</span>
            </Link>
          ) : (
            <button className="btn btn-outline" onClick={() => setSearch("")}>
              Reset Pencarian
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
