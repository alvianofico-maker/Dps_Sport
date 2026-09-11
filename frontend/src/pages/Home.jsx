import React from "react";
import Hero from "../components/Hero.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import Strip from "../components/Strip.jsx";
import { waHref } from "../api.js";

export default function Home({ settings }) {
  const wa = waHref(
    settings?.whatsapp || "6282178496326",
    "Halo Dps Sport, saya ingin bertanya-tanya tentang produk airgun."
  );

  return (
    <main>
      <Hero settings={settings} />
      <ProductGrid settings={settings} featured />
      <Strip />
      <a href={wa} target="_blank" rel="noopener noreferrer" className="fab" aria-label="WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1s-.7.9-.9 1.1-.4.2-.6.1c-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3z" />
          <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5.1-1.3c1.5.8 3.2 1.3 4.9 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-3.2.8.9-3.1-.2-.3C3.9 14.6 3.5 13.3 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z" />
        </svg>
      </a>
    </main>
  );
}
