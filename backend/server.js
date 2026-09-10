const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");

const app = express();
const PORT = process.env.PORT || 4000;
const DB_PATH = path.join(__dirname, "db.json");
const UPLOAD_DIR = path.join(__dirname, "uploads");

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR));

// ---------- simple JSON "database" helpers ----------
function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ---------- multer (image upload) ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${nanoid(10)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("File harus berupa gambar (png/jpg/webp/gif)"));
  },
});

// ================= ROUTES =================

// health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// --- settings (kontak, whatsapp, dll) ---
app.get("/api/settings", (req, res) => {
  const db = readDB();
  res.json(db.settings);
});
app.put("/api/settings", (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  res.json(db.settings);
});

// --- products ---
app.get("/api/products", (req, res) => {
  const db = readDB();
  const { category, q } = req.query;
  let items = db.products;
  if (category && category !== "Semua") {
    items = items.filter((p) => p.category === category);
  }
  if (q) {
    const term = q.toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(term));
  }
  res.json(items);
});

app.get("/api/products/:id", (req, res) => {
  const db = readDB();
  const item = db.products.find((p) => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Produk tidak ditemukan" });
  res.json(item);
});

app.post("/api/products", upload.single("image"), (req, res) => {
  const db = readDB();
  const body = req.body;
  const newProduct = {
    id: nanoid(8),
    name: body.name || "Produk Baru",
    category: body.category || "Lainnya",
    caliber: body.caliber || "-",
    length: body.length || "-",
    weight: body.weight || "-",
    priceOld: Number(body.priceOld) || 0,
    price: Number(body.price) || 0,
    discount: body.discount === "true" || body.discount === true,
    featured: body.featured === "true" || body.featured === true,
    image: req.file ? `/uploads/${req.file.filename}` : null,
  };
  db.products.unshift(newProduct);
  writeDB(db);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", upload.single("image"), (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Produk tidak ditemukan" });

  const body = req.body;
  const existing = db.products[idx];

  const updated = {
    ...existing,
    name: body.name ?? existing.name,
    category: body.category ?? existing.category,
    caliber: body.caliber ?? existing.caliber,
    length: body.length ?? existing.length,
    weight: body.weight ?? existing.weight,
    priceOld: body.priceOld !== undefined ? Number(body.priceOld) : existing.priceOld,
    price: body.price !== undefined ? Number(body.price) : existing.price,
    discount: body.discount !== undefined ? (body.discount === "true" || body.discount === true) : existing.discount,
    featured: body.featured !== undefined ? (body.featured === "true" || body.featured === true) : existing.featured,
  };

  if (req.file) {
    // remove old image file if it existed
    if (existing.image) {
      const oldPath = path.join(__dirname, existing.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    updated.image = `/uploads/${req.file.filename}`;
  }

  db.products[idx] = updated;
  writeDB(db);
  res.json(updated);
});

app.delete("/api/products/:id", (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Produk tidak ditemukan" });

  const [removed] = db.products.splice(idx, 1);
  if (removed.image) {
    const imgPath = path.join(__dirname, removed.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }
  writeDB(db);
  res.json({ success: true });
});

// error handler (multer etc.)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message || "Terjadi kesalahan" });
});

app.listen(PORT, () => {
  console.log(`✅ Dps Sport backend jalan di http://localhost:${PORT}`);
});
