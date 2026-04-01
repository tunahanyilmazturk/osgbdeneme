# 🏥 HanTech OSGB Yönetim Sistemi

Modern ve kullanıcı dostu İş Sağlığı ve Güvenliği (İSG) yönetim platformu.

## ✨ Özellikler

### 📊 Dashboard
- Gerçek zamanlı istatistikler ve grafikler
- Hızlı erişim kartları
- Durum göstergeleri
- Aylık trend analizi

### 🏢 Firma Yönetimi
- ✅ CRUD işlemleri (Oluştur, Oku, Güncelle, Sil)
- ✅ Detaylı firma profilleri
- ✅ Firma bazlı personel listesi
- ✅ Randevu ve teklif geçmişi
- ✅ Hızlı işlem kısayolları
- ✅ Excel export
- ✅ Gelişmiş arama ve filtreleme

### 👥 Personel Yönetimi
- ✅ Kart ve liste görünümleri
- ✅ Personel detay sayfaları
- ✅ Düzenleme ve silme işlemleri
- ✅ Firma bazlı gruplama
- ✅ Durum takibi (Aktif/Pasif)
- ✅ Excel export

### 📅 Randevu Sistemi
- ✅ Randevu planlama ve yönetimi
- ✅ Durum bazlı filtreleme
- ✅ Test ve personel ataması
- ✅ Saat aralığı belirleme
- ✅ Timeline görünümü

### 💰 Teklif Yönetimi
- ✅ Kalem bazlı teklif oluşturma
- ✅ Otomatik hesaplama (KDV dahil)
- ✅ İndirim yönetimi
- ✅ PDF export
- ✅ Durum yönetimi (Taslak, Gönderildi, Kabul, Red)
- ✅ Detaylı teklif görüntüleme

### 🔬 Sağlık Testleri
- ✅ Test kataloğu yönetimi
- ✅ Kategori bazlı organizasyon
- ✅ Fiyatlandırma
- ✅ Test süresi ve periyot takibi

### 📋 Sağlık Taramaları
- ✅ Toplu personel seçimi
- ✅ Çoklu test ataması
- ✅ Planlama ve durum takibi

### 📆 Takvim
- ✅ Aylık görünüm
- ✅ Etkinlik gösterimi
- ✅ Randevu entegrasyonu

### 📈 Raporlama
- ✅ Gelir/gider grafikleri
- ✅ Pie chart analizler
- ✅ Tablo bazlı raporlar
- ✅ Excel export

### ⚙️ Ayarlar
- ✅ Kullanıcı profili yönetimi
- ✅ Tema tercihleri (Light/Dark)
- ✅ Şirket bilgileri
- ✅ Güvenlik ayarları
- ✅ Bildirim tercihleri

### 🔍 Global Arama (Ctrl+K)
- ✅ Tüm sayfalarda hızlı arama
- ✅ Firma, personel, randevu arama
- ✅ Hızlı işlem kısayolları
- ✅ Klavye navigasyonu (↑↓, Enter, Esc)
- ✅ Kategori bazlı sonuçlar

### 🔔 Bildirim Sistemi
- ✅ Gerçek zamanlı bildirimler
- ✅ Okunmamış bildirim sayacı
- ✅ Bildirim detayları
- ✅ Tümünü okundu işaretle

### 📥 Export Özellikleri
- ✅ Excel export (Firmalar, Personel, Randevular)
- ✅ PDF export (Teklifler, Raporlar)
- ✅ Tablo bazlı PDF oluşturma

## 🚀 Teknolojiler

### Frontend
- **Framework**: Next.js 16.2 (App Router)
- **React**: 19.2
- **TypeScript**: Tip güvenli geliştirme
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/ui
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Calendar**: React Big Calendar
- **Export**: XLSX, jsPDF, html2canvas

### Özellikler
- ✅ Responsive tasarım (Mobile, Tablet, Desktop)
- ✅ Dark/Light mode
- ✅ Animasyonlu geçişler
- ✅ Toast bildirimleri
- ✅ Skeleton loading
- ✅ Error handling
- ✅ SEO optimizasyonu

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Production sunucusu
npm start
```

## 🔧 Geliştirme

```bash
# Linting
npm run lint

# Type check
npm run type-check

# Format check
npm run format
```

## 📁 Proje Yapısı

```
hantech/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Ana uygulama
│   │   ├── page.tsx      # Dashboard
│   │   ├── firmalar/     # Firma modülü
│   │   ├── personel/     # Personel modülü
│   │   ├── randevular/   # Randevu modülü
│   │   ├── teklifler/    # Teklif modülü
│   │   ├── taramalar/    # Tarama modülü
│   │   ├── saglik-testleri/
│   │   ├── takvim/
│   │   ├── raporlar/
│   │   └── ayarlar/
│   └── giris/            # Giriş sayfası
├── components/
│   ├── ui/               # UI bileşenleri
│   └── layout/           # Layout bileşenleri
├── lib/
│   ├── store.ts          # Zustand store
│   ├── utils.ts          # Yardımcı fonksiyonlar
│   ├── constants.ts      # Sabitler
│   └── export.ts         # Export fonksiyonları
├── types/
│   └── index.ts          # TypeScript tipleri
└── public/               # Statik dosyalar
```

## 🎯 Önemli Sayfalar

### Dashboard
- `/dashboard` - Ana gösterge paneli
- `/dashboard/firmalar` - Firma listesi
- `/dashboard/firmalar/[id]` - Firma detay
- `/dashboard/firmalar/[id]/duzenle` - Firma düzenleme
- `/dashboard/firmalar/yeni` - Yeni firma

### Personel
- `/dashboard/personel` - Personel listesi
- `/dashboard/personel/[id]` - Personel detay
- `/dashboard/personel/[id]/duzenle` - Personel düzenleme
- `/dashboard/personel/yeni` - Yeni personel

### Teklifler
- `/dashboard/teklifler` - Teklif listesi
- `/dashboard/teklifler/[id]` - Teklif detay
- `/dashboard/teklifler/yeni` - Yeni teklif

## ⌨️ Klavye Kısayolları

- `Ctrl + K` / `⌘ + K` - Global arama
- `Esc` - Modal/Dialog kapat
- `↑ ↓` - Arama sonuçlarında gezinme
- `Enter` - Seçili öğeyi aç

## 🎨 Tasarım Sistemi

### Renkler
- **Primary**: Mavi (#3B82F6)
- **Success**: Yeşil (#10B981)
- **Warning**: Turuncu (#F59E0B)
- **Danger**: Kırmızı (#EF4444)
- **Info**: Mavi (#3B82F6)

### Animasyonlar
- Fade in
- Slide in (left, right, up)
- Scale
- Float
- Pulse glow
- Gradient shift

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔐 Güvenlik

- XSS koruması
- CSRF token desteği
- Güvenli form validasyonu
- Şifre güç kontrolü

## 🚧 Gelecek Özellikler

### Backend Entegrasyonu
- [ ] Prisma ORM setup
- [ ] PostgreSQL database
- [ ] API Routes
- [ ] NextAuth.js authentication
- [ ] Redis cache

### Ek Özellikler
- [ ] E-posta bildirimleri
- [ ] SMS entegrasyonu
- [ ] Gelişmiş raporlama
- [ ] Toplu veri import
- [ ] WhatsApp entegrasyonu
- [ ] Rol bazlı yetkilendirme
- [ ] Aktivite logları

## 📝 Lisans

MIT License

## 👥 Geliştirici

HanTech OSGB Yönetim Sistemi

## 📞 Destek

Sorularınız için: support@hantech.com

---

**Not**: Bu proje frontend kısmı tamamlanmış durumdadır. Backend entegrasyonu için Prisma ve PostgreSQL kullanılması önerilir.
