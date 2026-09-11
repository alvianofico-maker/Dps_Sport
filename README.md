# Dps Sport — Website Katalog Airgun & Sparepart (Full-Stack)

Full-stack web catalog: **React (Vite)** di frontend + **Node.js/Express** di backend.
Backend mendukung Supabase untuk database dan storage, dengan fallback JSON lokal untuk development.

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
- Upload hingga 3 foto per produk dengan carousel otomatis dan swipe di halaman detail
- Edit produk yang sudah ada
- Mengisi dan mengubah deskripsi produk
- Mengisi spesifikasi bebas untuk berbagai jenis produk
- Hapus produk
- Data tersimpan ke Supabase jika env Supabase aktif, atau `backend/db.json` saat fallback lokal

## Konfigurasi Penting

### Supabase

1. Buat project di [Supabase](https://supabase.com/).
2. Buka **SQL Editor**, lalu jalankan seluruh isi `backend/supabase-schema.sql`.
3. Salin `backend/.env.example` menjadi `backend/.env`.
4. Isi `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` dari **Project Settings → API**.
  Service role key hanya boleh disimpan di backend dan jangan di-commit ke GitHub.
5. Jalankan backend seperti biasa. Saat env tersedia, CRUD admin dan data katalog memakai Supabase.

Bucket Storage yang digunakan adalah `product-images` dan harus public agar foto produk tampil di katalog.

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
