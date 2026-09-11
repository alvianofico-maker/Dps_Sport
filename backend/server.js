const express = require("express");
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 4000;
const DB_PATH = path.join(__dirname, "db.json");
const UPLOAD_DIR = path.join(__dirname, "uploads");
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "product-images";
const hasSupabaseConfig = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  && !SUPABASE_SERVICE_ROLE_KEY.includes("ISI_")
  && !SUPABASE_SERVICE_ROLE_KEY.includes("your-");
const supabase = hasSupabaseConfig
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

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

function fromProduct(row) {
  const images = Array.isArray(row.images) && row.images.length
    ? row.images
    : row.image ? [row.image] : [];
  return {
    ...row,
    images,
    image: images[0] || null,
    specifications: row.specifications || [row.caliber, row.length, row.weight].filter(Boolean).filter((value) => value !== "-").join(" | "),
    priceOld: row.price_old ?? row.priceOld ?? 0,
    price: row.price ?? 0,
  };
}

function toProduct(row) {
  const { priceOld, ...rest } = row;
  return { ...rest, price_old: Number(priceOld) || 0 };
}

function fromSettings(row) {
  return row;
}

async function getSettings() {
  if (!supabase) return readDB().settings;
  const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
  if (error) throw error;
  return fromSettings(data);
}

async function saveSettings(values) {
  if (!supabase) {
    const db = readDB();
    db.settings = { ...db.settings, ...values };
    writeDB(db);
    return db.settings;
  }
  const { data, error } = await supabase.from("settings").upsert({ id: 1, ...values }).select().single();
  if (error) throw error;
  return fromSettings(data);
}

async function getProducts() {
  if (!supabase) return readDB().products;
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(fromProduct);
}

async function getProduct(id) {
  if (!supabase) return readDB().products.find((product) => product.id === id);
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error && error.code === "PGRST116") return null;
  if (error) throw error;
  return fromProduct(data);
}

async function uploadImage(file) {
  if (!file) return null;
  if (!supabase) return `/uploads/${file.filename}`;
  const filePath = `${nanoid(12)}${path.extname(file.originalname)}`;
  const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(filePath, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

async function uploadImages(files = []) {
  return Promise.all(files.slice(0, 3).map((file) => uploadImage(file)));
}

async function resolveImageSlots(rawSlots, files = [], fallback = []) {
  const slots = Array.isArray(rawSlots) ? rawSlots.slice(0, 3) : [...fallback].slice(0, 3);
  for (const file of files) {
    const index = Number(file.fieldname.replace("image", ""));
    if (Number.isInteger(index) && index >= 0 && index < 3) {
      slots[index] = await uploadImage(file);
    }
  }
  return slots.filter(Boolean);
}

// ---------- multer (image upload) ----------
const storage = supabase
  ? multer.memoryStorage()
  : multer.diskStorage({
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
app.get("/api/settings", async (req, res, next) => {
  try {
    res.json(await getSettings());
  } catch (error) {
    next(error);
  }
});
app.put("/api/settings", async (req, res, next) => {
  try {
    res.json(await saveSettings(req.body));
  } catch (error) {
    next(error);
  }
});

// --- products ---
app.get("/api/products", async (req, res, next) => {
  const { category, q } = req.query;
  try {
    let items = await getProducts();
    if (category && category !== "Semua") items = items.filter((p) => p.category === category);
    if (q) items = items.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    res.json(items);
  } catch (error) {
    next(error);
  }
});

app.get("/api/products/:id", async (req, res, next) => {
  try {
    const item = await getProduct(req.params.id);
    if (!item) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

app.post("/api/products", upload.any(), async (req, res, next) => {
  try {
    const body = req.body;
    const newProduct = {
      id: nanoid(8),
      name: body.name || "Produk Baru",
      category: body.category || "Lainnya",
      description: body.description || "",
      specifications: body.specifications || "",
      caliber: body.caliber || "-",
      length: body.length || "-",
      weight: body.weight || "-",
      priceOld: Number(body.priceOld) || 0,
      price: Number(body.price) || 0,
      discount: body.discount === "true" || body.discount === true,
      featured: body.featured === "true" || body.featured === true,
      images: await resolveImageSlots(JSON.parse(req.body.imageSlots || "[]"), req.files),
    };
    if (!supabase) {
      const db = readDB();
      db.products.unshift(newProduct);
      writeDB(db);
    } else {
      const { error } = await supabase.from("products").insert(toProduct(newProduct));
      if (error) throw error;
    }
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

app.put("/api/products/:id", upload.any(), async (req, res, next) => {
  try {
    const existing = await getProduct(req.params.id);
    if (!existing) return res.status(404).json({ error: "Produk tidak ditemukan" });
    const body = req.body;
    const updated = {
      ...existing,
      name: body.name ?? existing.name,
      category: body.category ?? existing.category,
      description: body.description ?? existing.description ?? "",
      specifications: body.specifications ?? existing.specifications ?? "",
      caliber: body.caliber ?? existing.caliber,
      length: body.length ?? existing.length,
      weight: body.weight ?? existing.weight,
      priceOld: body.priceOld !== undefined ? Number(body.priceOld) : existing.priceOld,
      price: body.price !== undefined ? Number(body.price) : existing.price,
      discount: body.discount !== undefined ? (body.discount === "true" || body.discount === true) : existing.discount,
      featured: body.featured !== undefined ? (body.featured === "true" || body.featured === true) : existing.featured,
      images: await resolveImageSlots(
        req.body.imageSlots ? JSON.parse(req.body.imageSlots) : undefined,
        req.files,
        existing.images || (existing.image ? [existing.image] : [])
      ),
    };
    if (!supabase) {
      const db = readDB();
      db.products[db.products.findIndex((product) => product.id === req.params.id)] = updated;
      writeDB(db);
    } else {
      const { error } = await supabase.from("products").update(toProduct(updated)).eq("id", req.params.id);
      if (error) throw error;
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/products/:id", async (req, res, next) => {
  try {
    const existing = await getProduct(req.params.id);
    if (!existing) return res.status(404).json({ error: "Produk tidak ditemukan" });
    if (!supabase) {
      const db = readDB();
      const idx = db.products.findIndex((product) => product.id === req.params.id);
      db.products.splice(idx, 1);
      if (existing.image) {
        const imgPath = path.join(__dirname, existing.image);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }
      writeDB(db);
    } else {
      const { error } = await supabase.from("products").delete().eq("id", req.params.id);
      if (error) throw error;
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// error handler (multer etc.)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message || "Terjadi kesalahan" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Dps Sport backend jalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
