# Migration ve Seeder Rehberi

Bu rehber, veritabanı migration ve seeder işlemlerini açıklar.

## 📋 Komutlar

### Migration Çalıştır
Veritabanı ve tabloları oluşturur:
```bash
npm run migrate
```

### Seeder Çalıştır
Örnek veriler ekler:
```bash
npm run seed
```

### Migration + Seeder
Her ikisini sırayla çalıştırır:
```bash
npm run migrate:seed
```

### Veritabanı Sıfırla
Veritabanını tamamen siler ve yeniden oluşturur:
```bash
npm run reset
```

### Tam Sıfırlama (Fresh)
Veritabanını siler, tabloları oluşturur ve örnek veriler ekler:
```bash
npm run db:fresh
```

## 📁 Dosya Yapısı

```
backend/
├── scripts/
│   ├── migrate.js      # Veritabanı ve tabloları oluşturur
│   ├── seed.js         # Örnek veriler ekler
│   └── reset.js        # Veritabanını siler
└── MIGRATION_GUIDE.md  # Bu dosya
```

## 🗄️ Veritabanı Şeması

### Tablolar

#### 1. urunler
- Ürün bilgileri
- Stok miktarı
- Minimum stok seviyesi

#### 2. stok_hareketleri
- Stok giriş/çıkış kayıtları
- Ürün referansı
- Hareket tarihi

#### 3. faturalar
- Fatura bilgileri
- Müşteri adı
- Tutar
- Fatura tipi (Alış/Satış)

#### 4. irsaliyeler
- İrsaliye bilgileri
- Müşteri adı
- Açıklama

#### 5. personel
- Personel bilgileri
- İletişim bilgileri
- Pozisyon
- Maaş

#### 6. izinler
- İzin kayıtları
- İzin tipi (Yıllık/Hastalık/Mazeret)
- Başlangıç ve bitiş tarihleri

#### 7. vardiyalar
- Vardiya bilgileri
- Vardiya tipi (Sabah/Öğlen/Gece)
- Başlangıç ve bitiş saatleri

#### 8. bordrolar
- Bordro bilgileri
- Brüt maaş
- Kesintiler
- Net maaş

## 📊 Seeder Verileri

### Ürünler (10 adet)
- Bilgisayar ekipmanları (Laptop, Fare, Klavye, Monitor, vb.)
- Yazıcı ve aksesuarları
- Ağ ekipmanları

### Personel (8 kişi)
- Müdür
- Muhasebeci
- Satış Temsilcisi
- İnsan Kaynakları
- Depo Sorumlusu
- Sekreter
- Teknisyen
- Pazarlama

### Faturalar (8 adet)
- Alış ve satış faturaları
- Farklı müşteriler
- Çeşitli tutarlar

### İrsaliyeler (6 adet)
- Farklı müşterilere gönderilen irsaliyeler

### Stok Hareketleri (8 adet)
- Ürün giriş ve çıkış kayıtları

### İzinler (5 adet)
- Yıllık izin
- Hastalık izni
- Mazeret izni

### Vardiyalar (8 adet)
- Sabah, öğlen ve gece vardiyaları

### Bordrolar (8 adet)
- Personel bordroları
- Brüt maaş, kesintiler ve net maaş

## 🔧 Özel Kullanım

### Yalnızca Tabloları Oluştur
```bash
npm run migrate
```

### Yalnızca Veri Ekle
```bash
npm run seed
```

### Veritabanını Sıfırla ve Yeniden Oluştur
```bash
npm run db:fresh
```

## 🐛 Sorun Giderme

### "Access denied for user 'root'@'localhost'"
- MySQL'in çalışıp çalışmadığını kontrol edin
- `.env` dosyasındaki şifreyi kontrol edin

### "Can't create database; database exists"
- Veritabanı zaten var
- `npm run reset` ile sıfırlayın

### "Table already exists"
- Tablolar zaten oluşturulmuş
- `npm run reset` ile sıfırlayın

## 📝 Notlar

- Migration ve seeder işlemleri idempotent'dir (birden fazla çalıştırılabilir)
- Seeder, mevcut verileri silmez, yalnızca yeni veriler ekler
- Reset işlemi tüm verileri siler, dikkatli kullanın

## 🚀 Hızlı Başlangıç

Yeni bir proje için:
```bash
npm run db:fresh
```

Bu komut:
1. Veritabanını siler
2. Tabloları oluşturur
3. Örnek veriler ekler

## 📚 İlgili Dosyalar

- `backend/.env` - Veritabanı konfigürasyonu
- `backend/config/database.js` - Veritabanı bağlantısı
- `backend/server.js` - Express sunucusu
