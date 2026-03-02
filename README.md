# Instafinds.id - Public Website

Website afiliasi modern untuk Instafinds.id dengan desain Instagram-themed yang responsif.

## 📋 Struktur File

- `index.html` - Halaman utama website
- `styles.css` - Styling dan responsif design
- `script.js` - Fungsi JavaScript (load produk, tracking, dll)

## 🚀 Fitur

- **Desain Modern & Responsif** - Optimal untuk desktop, tablet, dan mobile
- **Gradient Instagram Theme** - Warna gradien ungu, pink, dan orange
- **Produk Dinamis** - Produk dimuat otomatis dari Admin Panel
- **Analytics Tracking** - Tracking click dan views untuk setiap produk
- **Multi-Platform Affiliate** - Support Shopee, Tokopedia, Lazada, Amazon, Bukalapak
- **Newsletter Subscription** - Form untuk berlangganan promo eksklusif
- **Smooth Animations** - Transisi dan animasi yang mulus

## 📦 Teknologi

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Font Awesome 6.0 CDN
- LocalStorage untuk data persistence

## 💾 Data Storage

Produk disimpan di LocalStorage dengan key: `instafinds_products`

```json
{
  "id": "1234567890",
  "name": "Nama Produk",
  "image": "url-gambar",
  "category": "1",
  "price": 100000,
  "originalPrice": 150000,
  "discount": 33,
  "rating": 4.5,
  "reviews": 245,
  "platforms": ["shopee", "tokopedia"],
  "affiliateLink": "https://...",
  "clicks": 15,
  "views": 250
}
```

## 🔗 Integrasi Admin Panel

Script.js otomatis load produk dari `instafinds_products` di LocalStorage yang dibuat oleh Admin Panel.

Untuk menambah/edit produk, akses Admin Panel → https://botbynetz.github.io/Instafinds-Admin/

## 📱 Responsive Breakpoints

- Desktop: > 1200px
- Tablet: 768px - 1200px
- Mobile: < 768px

## 🎨 Warna Tema

- Primary Gradient: `#667eea` → `#764ba2`
- Secondary Gradient: `#f093fb` → `#ff6b6b`
- Tertiary Gradient: `#4facfe` → `#00f2fe`

## 🚀 Deployment

Website sudah di-deploy di GitHub Pages:
- URL: https://botbynetz.github.io/Instafinds/

### Setup GitHub Pages (jika fork)

1. Push files ke repository `Instafinds`
2. Go to Settings → Pages
3. Source: Deploy from a branch
4. Branch: `main` / `master`
5. Save

Website akan live dalam beberapa menit.

## 📖 Penggunaan

1. Upload files (index.html, styles.css, script.js) ke root repository
2. Pastikan Admin Panel sudah setup di repository terpisah
3. Buka website di https://username.github.io/Instafinds/
4. Admin Panel akan otomatis sync data via LocalStorage

## 🐛 Troubleshooting

**Produk tidak muncul?**
- Pastikan sudah buka Admin Panel terlebih dahulu untuk menambah produk
- Check browser console (F12) untuk error messages
- Pastikan LocalStorage tidak penuh (max ~5MB)

**Styling tidak muncul?**
- Clear browser cache (Ctrl+Shift+Delete)
- Reload page (Ctrl+F5)

## 📝 Catatan

- LocalStorage shared antar domain yang sama
- Hapus data dari Settings → Reset All Data di Admin Panel jika perlu fresh start
- Export data secara berkala dari Admin Panel untuk backup

## 📞 Support

Hubungi admin atau check console untuk debugging issues.

---

Last Updated: 2024
Instafinds Admin Team
