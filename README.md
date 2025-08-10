
# Proyek Frontend - Tree Menu CRUD

Proyek ini adalah aplikasi frontend untuk mengelola struktur menu dalam format tree. Aplikasi ini mendukung operasi CRUD (Create, Read, Update, Delete) dengan pembaruan data secara realtime.

## Fitur Utama

- **Tampilan Tree Interaktif:** Menampilkan data menu dalam format hierarki pohon yang intuitif.
- **Operasi CRUD:** Memungkinkan pengguna untuk membuat, membaca, memperbarui, dan menghapus item menu.
- **Realtime Update:** Setiap perubahan data akan diperbarui secara otomatis di seluruh aplikasi tanpa perlu memuat ulang halaman.
- **Hierarki Tak Terbatas:** Struktur menu mendukung anak (child) yang tidak terbatas, memberikan fleksibilitas penuh dalam pembuatan menu.
- **Animasi dan Visual:** Menggunakan Framer Motion untuk animasi, Tailwind CSS untuk styling, dan Lucide React untuk ikon. Garis penunjuk (indicator lines) dibuat untuk memperjelas hubungan antar menu.

## Teknologi yang Digunakan

- Framework: **Next.js**
- Styling: **Tailwind CSS**
- Animasi: **Framer Motion**
- Ikon: **Lucide React**
- Data Fetching: **Axios**

## Prasyarat

Pastikan Anda telah menginstal **Node.js** dan **npm** (atau **yarn**) di sistem Anda.

## Instalasi dan Menjalankan Aplikasi

### 1. Jalankan Backend Terlebih Dahulu

Pastikan server backend Anda sudah berjalan. Aplikasi frontend ini mengambil data dari API di `http://localhost:3000/api`.  
Jika URL backend Anda berbeda, silakan sesuaikan di file `.env.local`.

### 2. Instalasi Proyek Frontend

```bash
git clone https://github.com/ioarintoko/menu-tree-next
cd menu-tree-next
npm install
# atau
yarn install
```

### 3. Menjalankan Frontend

```bash
npm run dev
# atau
yarn dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

## Konfigurasi API

Aplikasi ini mengambil data dari API backend. Buat file `.env.local` di root folder proyek dan tambahkan URL API Anda.

Contoh isi file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Pengembangan Lebih Lanjut

Beberapa fitur yang direncanakan untuk pengembangan di masa depan:

- **Maksimal Kedalaman (Max Depth):** Menambahkan opsi untuk membatasi kedalaman hierarki menu.
- **Multi-Parent:** Mengimplementasikan fitur di mana sebuah item menu dapat memiliki lebih dari satu parent.

---

**Terima kasih telah menggunakan proyek ini. Jika ada pertanyaan atau kontribusi, silakan hubungi atau buat issue di repository.**
