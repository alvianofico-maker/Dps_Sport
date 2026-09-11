import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Admin from "./pages/Admin.jsx";
import { api } from "./api.js";

export default function App() {
  const [settings, setSettings] = useState(null);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <>
      {!isAdmin && <Navbar settings={settings} />}
      <Routes>
        <Route path="/" element={<Home settings={settings} />} />
        <Route path="/produk" element={<Products settings={settings} />} />
        <Route path="/produk/:id" element={<ProductDetail settings={settings} />} />
        <Route path="/tentang" element={<About />} />
        <Route path="/kontak" element={<Contact settings={settings} />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!isAdmin && <Footer settings={settings} />}
    </>
  );
}
