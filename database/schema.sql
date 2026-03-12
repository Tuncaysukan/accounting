CREATE DATABASE IF NOT EXISTS stok_muhasebe;
USE stok_muhasebe;

-- Ürünler tablosu
CREATE TABLE IF NOT EXISTS urunler (
  id INT PRIMARY KEY AUTO_INCREMENT,
  urun_adi VARCHAR(255) NOT NULL,
  stok_miktari DECIMAL(10,2) DEFAULT 0,
  birim VARCHAR(50),
  min_stok DECIMAL(10,2) DEFAULT 0,
  olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stok hareketleri
CREATE TABLE IF NOT EXISTS stok_hareketleri (
  id INT PRIMARY KEY AUTO_INCREMENT,
  urun_id INT,
  hareket_tipi ENUM('giris', 'cikis') NOT NULL,
  miktar DECIMAL(10,2) NOT NULL,
  aciklama TEXT,
  tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (urun_id) REFERENCES urunler(id)
);

-- Faturalar
CREATE TABLE IF NOT EXISTS faturalar (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fatura_no VARCHAR(50) UNIQUE NOT NULL,
  musteri_adi VARCHAR(255) NOT NULL,
  tutar DECIMAL(10,2) NOT NULL,
  fatura_tipi ENUM('alis', 'satis') NOT NULL,
  tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İrsaliyeler
CREATE TABLE IF NOT EXISTS irsaliyeler (
  id INT PRIMARY KEY AUTO_INCREMENT,
  irsaliye_no VARCHAR(50) UNIQUE NOT NULL,
  musteri_adi VARCHAR(255) NOT NULL,
  aciklama TEXT,
  tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personel
CREATE TABLE IF NOT EXISTS personel (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ad VARCHAR(100) NOT NULL,
  soyad VARCHAR(100) NOT NULL,
  tc_no VARCHAR(11) UNIQUE,
  telefon VARCHAR(20),
  email VARCHAR(100),
  pozisyon VARCHAR(100),
  maas DECIMAL(10,2),
  ise_giris_tarihi DATE
);

-- İzinler
CREATE TABLE IF NOT EXISTS izinler (
  id INT PRIMARY KEY AUTO_INCREMENT,
  personel_id INT,
  izin_tipi ENUM('yillik', 'hastalik', 'mazeret') NOT NULL,
  baslangic_tarihi DATE NOT NULL,
  bitis_tarihi DATE NOT NULL,
  aciklama TEXT,
  FOREIGN KEY (personel_id) REFERENCES personel(id)
);

-- Vardiyalar
CREATE TABLE IF NOT EXISTS vardiyalar (
  id INT PRIMARY KEY AUTO_INCREMENT,
  personel_id INT,
  tarih DATE NOT NULL,
  vardiya_tipi ENUM('sabah', 'oglen', 'gece') NOT NULL,
  baslangic_saati TIME,
  bitis_saati TIME,
  FOREIGN KEY (personel_id) REFERENCES personel(id)
);

-- Kullanıcılar
CREATE TABLE IF NOT EXISTS kullanicilar (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kullanici_adi VARCHAR(100) UNIQUE NOT NULL,
  sifre VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'muhasebe', 'stok', 'ik') NOT NULL,
  ad VARCHAR(100),
  soyad VARCHAR(100),
  email VARCHAR(100),
  aktif TINYINT(1) DEFAULT 1,
  olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bordrolar
CREATE TABLE IF NOT EXISTS bordrolar (
  id INT PRIMARY KEY AUTO_INCREMENT,
  personel_id INT,
  donem VARCHAR(7) NOT NULL,
  brut_maas DECIMAL(10,2),
  kesintiler DECIMAL(10,2),
  net_maas DECIMAL(10,2),
  olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (personel_id) REFERENCES personel(id)
);
