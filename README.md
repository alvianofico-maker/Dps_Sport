# Dps Sport — Website Katalog Airgun & Sparepart (Full-Stack)

Full-stack web catalog: **React (Vite)** di frontend + **Node.js/Express** di backend,
dengan penyimpanan data produk berbasis file JSON (`backend/db.json`) dan upload foto produk.

## Struktur Folder

```
dps-sport-fullstack/
├── backend/          → Express API (CRUD produk, upload gambar, settings)
│   ├── server.js
│   ├── db.json        (database produk, otomatis ter-update)
│   └── uploads/        (foto produk yang di-upload)
└── frontend/          → React app (Vite)
    └── src/
        ├── components/  (Navbar, Hero, ProductGrid, dst)
        └── pages/       (Home, Admin)
```

## Cara Menjalankan (Development)

Buka **2 terminal terpisah**:

**Terminal 1 — Backend**
```bash
cd backend
npm install
npm start
```
Backend akan jalan di `http://localhost:4000`

**Terminal 2 — Frontend**
```bash
cd frontend
npm install
npm run dev
```
Frontend akan jalan di `http://localhost:5173` (otomatis proxy `/api` dan `/uploads` ke backend, sudah dikonfigurasi di `vite.config.js`)

Buka browser ke **http://localhost:5173**

## Admin Panel

Buka `http://localhost:5173/admin` (atau klik link "⚙️ Admin" di footer).

- Password default: `dpssport123`
- Bisa diganti di `frontend/src/pages/Admin.jsx` → variabel `ADMIN_PASSWORD`
- ⚠️ Ini hanya proteksi sederhana di sisi client (cocok untuk penggunaan pribadi/internal).
  Untuk produksi publik, sebaiknya tambahkan autentikasi sungguhan di backend (JWT/session).

Dari admin panel kamu bisa:
- Tambah produk baru (termasuk upload foto)
- Edit produk yang sudah ada
- Hapus produk
- Data langsung tersimpan ke `backend/db.json` dan foto ke `backend/uploads/`

## Konfigurasi Penting

1. **Nomor WhatsApp** — buka `http://localhost:5173/admin` tidak mengatur ini;
   edit langsung di `backend/db.json` bagian `"settings"` lalu restart backend, contoh:
   ```json
   "settings": {
     "whatsapp": "6281234567890",
     "email": "email@kamu.com",
     "phone": "0812-xxxx-xxxx",
     "instagram": "@akun_kamu"
   }
   ```
   Atau update lewat API: `PUT http://localhost:4000/api/settings`

2. **Data produk awal** — sudah diisi contoh di `backend/db.json`, silakan edit/tambah lewat Admin Panel.

## Build untuk Produksi

```bash
cd frontend
npm run build
```
Hasil build ada di `frontend/dist/` — file statis siap di-hosting (Vercel, Netlify, Nginx, dll).
Untuk deploy, jalankan backend secara terpisah (mis. di VPS/Railway/Render) dan arahkan frontend
untuk fetch API ke URL backend production (ubah `BASE` di `frontend/src/api.js` atau set proxy sesuai kebutuhan hosting).

## Tech Stack

- **Frontend**: React 18, React Router, Vite, CSS murni (tanpa framework CSS)
- **Backend**: Express, Multer (upload gambar), penyimpanan JSON file (tanpa database eksternal — plug & play)
