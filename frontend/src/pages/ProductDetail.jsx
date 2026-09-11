import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatRp, waHref } from "../api.js";

function GunIcon() {
  return (
    <svg viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.3" opacity=".9">
        <rect x="14" y="38" width="90" height="9" rx="2" />
        <rect x="104" y="32" width="34" height="20" rx="3" />
        <path d="M138 36h48v6h-48z" /><circle cx="176" cy="39" r="9" /><circle cx="176" cy="39" r="5" />
        <rect x="30" y="47" width="9" height="22" rx="1.5" /><path d="m30 69-4 14h17l-2-14z" />
      </g>
    </svg>
  );
}

export default function ProductDetail({ settings }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStart = useRef(null);
  const swipeMoved = useRef(false);

  useEffect(() => {
    setProduct(null);
    setError("");
    setActive(0);
    api.getProduct(id).then(setProduct).catch((e) => setError(e.message));
  }, [id]);

  const images = useMemo(() => {
    if (!product) return [];
    return product.images?.length ? product.images : product.image ? [product.image] : [];
  }, [product]);

  useEffect(() => {
    if (images.length < 2 || isPaused || isLightboxOpen) return undefined;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % images.length), 2500);
    return () => window.clearInterval(timer);
  }, [images.length, isPaused, isLightboxOpen]);

  if (error) return <main className="inner-page"><div className="wrap"><div className="empty-state">{error}</div></div></main>;
  if (!product) return <main className="inner-page"><div className="wrap"><div className="loading-state">Memuat detail produk...</div></div></main>;

  const wa = waHref(settings?.whatsapp || "6282178496326", `Halo Dps Sport, saya tertarik dengan produk ${product.name}. Apakah masih tersedia?`);
  const specifications = product.specifications || [product.caliber, product.length, product.weight].filter(Boolean).filter((value) => value !== "-").join(" | ");
  const changeSlide = (direction) => setActive((current) => (current + direction + images.length) % images.length);

  return (
    <main className="inner-page product-detail-page">
      <div className="wrap">
        <Link to="/produk" className="back-link">← Kembali ke Produk</Link>
        <section className="product-detail">
          <div className="product-gallery">
            <div className="gallery-main" onPointerDown={() => setIsPaused(true)} onPointerUp={() => setIsPaused(false)} onPointerCancel={() => setIsPaused(false)} onPointerLeave={() => setIsPaused(false)} onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; swipeMoved.current = false; }} onTouchEnd={(event) => {
              if (touchStart.current === null || images.length < 2) return;
              const distance = event.changedTouches[0].clientX - touchStart.current;
              if (Math.abs(distance) > 40) { swipeMoved.current = true; changeSlide(distance < 0 ? 1 : -1); }
              touchStart.current = null;
            }}>
              {images.length ? (
                <div className="gallery-track" style={{ transform: `translateX(-${active * 100}%)` }}>
                  {images.map((image, index) => (
                    <img key={image} src={image} alt={`${product.name} ${index + 1}`} onClick={() => {
                      if (!swipeMoved.current) setIsLightboxOpen(true);
                      swipeMoved.current = false;
                    }} />
                  ))}
                </div>
              ) : <GunIcon />}
              {images.length > 1 && <>
                <button className="gallery-arrow gallery-prev" onClick={() => changeSlide(-1)} aria-label="Foto sebelumnya">‹</button>
                <button className="gallery-arrow gallery-next" onClick={() => changeSlide(1)} aria-label="Foto berikutnya">›</button>
              </>}
            </div>
            {images.length > 1 && <div className="gallery-dots">
              {images.map((image, index) => <button key={image} className={index === active ? "active" : ""} onClick={() => setActive(index)} aria-label={`Lihat foto ${index + 1}`} />)}
            </div>}
          </div>
          <div className="product-detail-copy">
            {product.discount && <span className="badge">Diskon</span>}
            <div className="eyebrow">DETAIL PRODUK</div>
            <h1>{product.name}</h1>
            {product.description && <p className="detail-description">{product.description}</p>}
            <div className="detail-price">
              {product.discount && <span className="price-old">{formatRp(product.priceOld)}</span>}
              <span className="detail-price-current">{formatRp(product.price)}</span>
            </div>
            <div className="detail-specs"><h3>Spesifikasi</h3><p>{specifications || "Spesifikasi belum ditambahkan."}</p></div>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Tanya via WhatsApp <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </div>
      {isLightboxOpen && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Foto produk ukuran besar" onClick={() => setIsLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setIsLightboxOpen(false)} aria-label="Tutup foto">×</button>
          {images.length > 1 && <>
            <button className="gallery-arrow gallery-prev" onClick={(event) => { event.stopPropagation(); changeSlide(-1); }} aria-label="Foto sebelumnya">‹</button>
            <button className="gallery-arrow gallery-next" onClick={(event) => { event.stopPropagation(); changeSlide(1); }} aria-label="Foto berikutnya">›</button>
          </>}
          <img src={images[active]} alt={`${product.name} ukuran besar`} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </main>
  );
}
