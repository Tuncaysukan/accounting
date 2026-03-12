import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'stok_muhasebe',
  waitForConnections: true,
  connectionLimit: 10
});

async function seedDatabase() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🌱 Seeder başlatılıyor...\n');

    // Kullanıcıları ekle
    console.log('👤 Kullanıcılar ekleniyor...');
    const kullanicilar = [
      ['admin', 'admin@example.com', 'admin123', 'Sistem Yöneticisi', 'admin'],
      ['muhasebe', 'muhasebe@example.com', 'muhasebe123', 'Muhasebe Müdürü', 'muhasebe'],
      ['stok', 'stok@example.com', 'stok123', 'Stok Sorumlusu', 'stok'],
      ['ik', 'ik@example.com', 'ik123', 'İK Müdürü', 'ik'],
      ['personel1', 'personel1@example.com', 'personel123', 'Personel 1', 'personel'],
      ['personel2', 'personel2@example.com', 'personel123', 'Personel 2', 'personel']
    ];

    for (const [kullanici_adi, email, sifre, ad_soyad, rol] of kullanicilar) {
      const hashedPassword = await bcrypt.hash(sifre, 10);
      await connection.query(
        'INSERT INTO kullanicilar (kullanici_adi, email, sifre, ad_soyad, rol) VALUES (?, ?, ?, ?, ?)',
        [kullanici_adi, email, hashedPassword, ad_soyad, rol]
      );
    }
    console.log(`✅ ${kullanicilar.length} kullanıcı eklendi\n`);

    // Ürünleri ekle
    console.log('📦 Ürünler ekleniyor...');
    const urunler = [
      ['Laptop', 50, 'Adet', 10],
      ['Fare', 200, 'Adet', 50],
      ['Klavye', 150, 'Adet', 30],
      ['Monitor', 80, 'Adet', 15],
      ['Yazıcı', 20, 'Adet', 5],
      ['Kağıt A4', 500, 'Paket', 100],
      ['Toner', 100, 'Adet', 20],
      ['USB Kablo', 300, 'Adet', 50],
      ['Ethernet Kablo', 250, 'Metre', 50],
      ['Güç Kaynağı', 60, 'Adet', 10]
    ];

    for (const urun of urunler) {
      await connection.query(
        'INSERT INTO urunler (urun_adi, stok_miktari, birim, min_stok) VALUES (?, ?, ?, ?)',
        urun
      );
    }
    console.log(`✅ ${urunler.length} ürün eklendi\n`);

    // Personel ekle
    console.log('👥 Personel ekleniyor...');
    const personeller = [
      ['Ahmet', 'Yılmaz', '12345678901', '05551234567', 'ahmet@example.com', 'Müdür', 5000, '2023-01-15'],
      ['Fatma', 'Kaya', '12345678902', '05552234567', 'fatma@example.com', 'Muhasebeci', 3500, '2023-02-20'],
      ['Mehmet', 'Demir', '12345678903', '05553234567', 'mehmet@example.com', 'Satış Temsilcisi', 3000, '2023-03-10'],
      ['Ayşe', 'Şahin', '12345678904', '05554234567', 'ayse@example.com', 'İnsan Kaynakları', 3200, '2023-04-05'],
      ['Ali', 'Çetin', '12345678905', '05555234567', 'ali@example.com', 'Depo Sorumlusu', 2800, '2023-05-12'],
      ['Zeynep', 'Aydın', '12345678906', '05556234567', 'zeynep@example.com', 'Sekreter', 2500, '2023-06-01'],
      ['Hasan', 'Güzel', '12345678907', '05557234567', 'hasan@example.com', 'Teknisyen', 3800, '2023-07-15'],
      ['Elif', 'Yıldız', '12345678908', '05558234567', 'elif@example.com', 'Pazarlama', 3300, '2023-08-20']
    ];

    for (const personel of personeller) {
      await connection.query(
        'INSERT INTO personel (ad, soyad, tc_no, telefon, email, pozisyon, maas, ise_giris_tarihi) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        personel
      );
    }
    console.log(`✅ ${personeller.length} personel eklendi\n`);

    // Faturalar ekle
    console.log('📄 Faturalar ekleniyor...');
    const faturalar = [
      ['FAT001', 'ABC Şirketi', 5000, 'satis', 'İlk satış'],
      ['FAT002', 'XYZ Ltd.', 3500, 'alis', 'Malzeme alımı'],
      ['FAT003', 'DEF Ticaret', 7200, 'satis', 'Toplu sipariş'],
      ['FAT004', 'GHI İnşaat', 4800, 'alis', 'Ekipman alımı'],
      ['FAT005', 'JKL Elektrik', 6500, 'satis', 'Proje satışı'],
      ['FAT006', 'MNO Gıda', 2900, 'alis', 'Gıda malzemeleri'],
      ['FAT007', 'PQR Tekstil', 8100, 'satis', 'Kumaş satışı'],
      ['FAT008', 'STU Otomotiv', 5600, 'alis', 'Yedek parça']
    ];

    for (const fatura of faturalar) {
      await connection.query(
        'INSERT INTO faturalar (fatura_no, musteri_adi, tutar, fatura_tipi, aciklama) VALUES (?, ?, ?, ?, ?)',
        fatura
      );
    }
    console.log(`✅ ${faturalar.length} fatura eklendi\n`);

    // İrsaliyeler ekle
    console.log('📦 İrsaliyeler ekleniyor...');
    const irsaliyeler = [
      ['IRS001', 'ABC Şirketi', 'Bilgisayar ekipmanları'],
      ['IRS002', 'XYZ Ltd.', 'Yazıcı ve aksesuarları'],
      ['IRS003', 'DEF Ticaret', 'Monitör ve kablolar'],
      ['IRS004', 'GHI İnşaat', 'Güç kaynakları'],
      ['IRS005', 'JKL Elektrik', 'Ağ ekipmanları'],
      ['IRS006', 'MNO Gıda', 'Kağıt ürünleri']
    ];

    for (const irsaliye of irsaliyeler) {
      await connection.query(
        'INSERT INTO irsaliyeler (irsaliye_no, musteri_adi, aciklama) VALUES (?, ?, ?)',
        irsaliye
      );
    }
    console.log(`✅ ${irsaliyeler.length} irsaliye eklendi\n`);

    // Stok hareketleri ekle
    console.log('📊 Stok hareketleri ekleniyor...');
    const hareketler = [
      [1, 'giris', 50, 'İlk stok'],
      [2, 'giris', 200, 'İlk stok'],
      [3, 'giris', 150, 'İlk stok'],
      [1, 'cikis', 5, 'Satış'],
      [2, 'cikis', 20, 'Satış'],
      [4, 'giris', 80, 'İlk stok'],
      [5, 'giris', 20, 'İlk stok'],
      [3, 'cikis', 10, 'Satış']
    ];

    for (const hareket of hareketler) {
      await connection.query(
        'INSERT INTO stok_hareketleri (urun_id, hareket_tipi, miktar, aciklama) VALUES (?, ?, ?, ?)',
        hareket
      );
    }
    console.log(`✅ ${hareketler.length} stok hareketi eklendi\n`);

    // İzinler ekle
    console.log('🏖️ İzinler ekleniyor...');
    const izinler = [
      [1, 'yillik', '2024-01-15', '2024-01-25', 'Yıllık izin'],
      [2, 'hastalik', '2024-02-10', '2024-02-12', 'Hastalık izni'],
      [3, 'mazeret', '2024-03-05', '2024-03-06', 'Mazeret izni'],
      [4, 'yillik', '2024-04-01', '2024-04-15', 'Yıllık izin'],
      [5, 'hastalik', '2024-05-20', '2024-05-21', 'Hastalık izni']
    ];

    for (const izin of izinler) {
      await connection.query(
        'INSERT INTO izinler (personel_id, izin_tipi, baslangic_tarihi, bitis_tarihi, aciklama) VALUES (?, ?, ?, ?, ?)',
        izin
      );
    }
    console.log(`✅ ${izinler.length} izin kaydı eklendi\n`);

    // Vardiyalar ekle
    console.log('⏰ Vardiyalar ekleniyor...');
    const vardiyalar = [
      [1, '2024-01-15', 'sabah', '08:00:00', '16:00:00'],
      [2, '2024-01-15', 'oglen', '12:00:00', '20:00:00'],
      [3, '2024-01-15', 'gece', '20:00:00', '04:00:00'],
      [4, '2024-01-16', 'sabah', '08:00:00', '16:00:00'],
      [5, '2024-01-16', 'oglen', '12:00:00', '20:00:00'],
      [6, '2024-01-16', 'gece', '20:00:00', '04:00:00'],
      [7, '2024-01-17', 'sabah', '08:00:00', '16:00:00'],
      [8, '2024-01-17', 'oglen', '12:00:00', '20:00:00']
    ];

    for (const vardiya of vardiyalar) {
      await connection.query(
        'INSERT INTO vardiyalar (personel_id, tarih, vardiya_tipi, baslangic_saati, bitis_saati) VALUES (?, ?, ?, ?, ?)',
        vardiya
      );
    }
    console.log(`✅ ${vardiyalar.length} vardiya kaydı eklendi\n`);

    // Bordrolar ekle
    console.log('💰 Bordrolar ekleniyor...');
    const bordrolar = [
      [1, '2024-01', 5000, 500, 4500],
      [2, '2024-01', 3500, 350, 3150],
      [3, '2024-01', 3000, 300, 2700],
      [4, '2024-01', 3200, 320, 2880],
      [5, '2024-01', 2800, 280, 2520],
      [6, '2024-01', 2500, 250, 2250],
      [7, '2024-01', 3800, 380, 3420],
      [8, '2024-01', 3300, 330, 2970]
    ];

    for (const bordro of bordrolar) {
      await connection.query(
        'INSERT INTO bordrolar (personel_id, donem, brut_maas, kesintiler, net_maas) VALUES (?, ?, ?, ?, ?)',
        bordro
      );
    }
    console.log(`✅ ${bordrolar.length} bordro kaydı eklendi\n`);

    console.log('✨ Seeder başarıyla tamamlandı!');
    console.log('\n📊 Özet:');
    console.log(`   - 6 kullanıcı`);
    console.log(`   - ${urunler.length} ürün`);
    console.log(`   - ${personeller.length} personel`);
    console.log(`   - ${faturalar.length} fatura`);
    console.log(`   - ${irsaliyeler.length} irsaliye`);
    console.log(`   - ${hareketler.length} stok hareketi`);
    console.log(`   - ${izinler.length} izin kaydı`);
    console.log(`   - ${vardiyalar.length} vardiya kaydı`);
    console.log(`   - ${bordrolar.length} bordro kaydı`);

    console.log('\n🔐 Demo Hesaplar:');
    console.log('   Kullanıcı Adı    | Şifre          | Rol');
    console.log('   ─────────────────┼────────────────┼──────────');
    console.log('   admin            | admin123       | Admin');
    console.log('   muhasebe         | muhasebe123    | Muhasebe');
    console.log('   stok             | stok123        | Stok');
    console.log('   ik               | ik123          | İK');
    console.log('   personel1        | personel123    | Personel');
    console.log('   personel2        | personel123    | Personel');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder hatası:', error.message);
    process.exit(1);
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedDatabase();
