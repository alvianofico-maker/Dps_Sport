import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatRp } from "../api.js";

const ADMIN_PASSWORD = "dpssport123"; // ganti password ini sesuai kebutuhan

const EMPTY_FORM = {
  name: "",
  category: "Senapan PCP",
  caliber: "",
  length: "",
  weight: "",
  priceOld: "",
  price: "",
  discount: false,
  featured: false,
};

export default function Admin() {
  const [authed, setAuthed] = useState(sessionStorage.getItem("dps_admin") === "1");
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  function loadProducts() {
    setLoading(true);
    api
      .getProducts()
      .then(setProducts)
      .catch((e) => setMsg({ type: "error", text: e.message }))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (authed) loadProducts();
  }, [authed]);

  function handleLogin(e) {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("dps_admin", "1");
      setAuthed(true);
      setPwError("");
    } else {
      setPwError("Password salah. Coba lagi.");
    }
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setEditingId(null);
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      caliber: p.caliber,
      length: p.length,
      weight: p.weight,
      priceOld: p.priceOld,
      price: p.price,
      discount: p.discount,
      featured: p.featured,
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        await api.updateProduct(editingId, fd);
        setMsg({ type: "success", text: "Produk berhasil diperbarui." });
      } else {
        await api.createProduct(fd);
        setMsg({ type: "success", text: "Produk baru berhasil ditambahkan." });
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      await api.deleteProduct(id);
      loadProducts();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
  }

  if (!authed) {
    return (
      <main className="admin-page">
        <div className="wrap">
          <div className="admin-login">
            <h2>🔒 Admin Login</h2>
            <p>Masukkan password untuk mengelola produk Dps Sport.</p>
            {pwError && <div className="error-msg">{pwError}</div>}
            <form onSubmit={handleLogin}>
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  value={pwInput}
                  onChange={(e) => setPwInput(e.target.value)}
                  autoFocus
                />
              </div>
              <button className="btn btn-primary btn-block" type="submit">Masuk</button>
            </form>
            <div style={{ marginTop: 18 }}>
              <Link to="/" className="admin-link">← Kembali ke Beranda</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="wrap">
        <div className="admin-header">
          <div>
            <div className="eyebrow">ADMIN PANEL</div>
            <h2 style={{ fontSize: 28 }}>Kelola Produk</h2>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/" className="btn btn-outline">← Lihat Website</Link>
            <button
              className="btn btn-danger"
              onClick={() => {
                sessionStorage.removeItem("dps_admin");
                setAuthed(false);
              }}
            >
              Keluar
            </button>
          </div>
        </div>

        {msg.text && (
          <div className={msg.type === "error" ? "error-msg" : "success-msg"}>{msg.text}</div>
        )}

        <div className="admin-form">
          <h3>{editingId ? "✏️ Edit Produk" : "➕ Tambah Produk Baru"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label>Nama Produk</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="mis. Predator OD 38"
                />
              </div>
              <div className="field">
                <label>Kategori</label>
                <input
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="mis. Senapan PCP"
                />
              </div>
              <div className="field">
                <label>Kaliber</label>
                <input
                  value={form.caliber}
                  onChange={(e) => setForm({ ...form, caliber: e.target.value })}
                  placeholder="mis. 4.5 mm"
                />
              </div>
              <div className="field">
                <label>Panjang</label>
                <input
                  value={form.length}
                  onChange={(e) => setForm({ ...form, length: e.target.value })}
                  placeholder="mis. 100 cm"
                />
              </div>
              <div className="field">
                <label>Berat</label>
                <input
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  placeholder="mis. 3.2 kg"
                />
              </div>
              <div className="field">
                <label>Harga Coret (opsional)</label>
                <input
                  type="number"
                  value={form.priceOld}
                  onChange={(e) => setForm({ ...form, priceOld: e.target.value })}
                  placeholder="1900000"
                />
              </div>
              <div className="field">
                <label>Harga Jual</label>
                <input
                  required
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="1800000"
                />
              </div>
              <div className="field">
                <label>Foto Produk</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
              </div>
              <div className="full" style={{ display: "flex", gap: 24 }}>
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="discount"
                    checked={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.checked })}
                  />
                  <label htmlFor="discount">Tampilkan badge diskon</label>
                </div>
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  <label htmlFor="featured">Produk unggulan</label>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Menyimpan..." : editingId ? "💾 Simpan Perubahan" : "➕ Tambah Produk"}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: 30 }}>⏳ Memuat...</td></tr>
              )}
              {!loading && products.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: 30 }}>Belum ada produk.</td></tr>
              )}
              {!loading &&
                products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.image ? (
                        <img src={p.image} alt={p.name} />
                      ) : (
                        <div className="thumb-placeholder">🔫</div>
                      )}
                    </td>
                    <td>
                      {p.name}
                      {p.featured && <span className="tag-featured">Unggulan</span>}
                    </td>
                    <td>{p.category}</td>
                    <td>{formatRp(p.price)}</td>
                    <td>{p.discount ? "Diskon" : "-"}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => startEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
