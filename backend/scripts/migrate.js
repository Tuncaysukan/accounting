import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  // İlk olarak veritabanı olmadan bağlan
  const initialPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10
  });

  let connection = await initialPool.getConnection();
  
  try {
    console.log('🔄 Migration başlatılıyor...\n');

    // Veritabanı oluştur
    const dbName = process.env.DB_NAME || 'stok_muhasebe';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log('✅ Veritabanı kontrol edildi');
    
    await connection.release();
    await initialPool.end();

    // Şimdi veritabanı ile bağlan
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10
    });

    connection = await pool.getConnection();

    // Tabloları oluştur
    const migrations = [
      {
        name: 'kullanicilar',
        sql: `
          CREATE TABLE IF NOT EXISTS kullanicilar (
            id INT PRIMARY KEY AUTO_INCREMENT,
            kullanici_adi VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE,
            sifre VARCHAR(255) NOT NULL,
            ad_soyad VARCHAR(255),
            rol ENUM('admin', 'muhasebe', 'stok', 'ik', 'personel') DEFAULT 'personel',
            durum ENUM('aktif', 'pasif') DEFAULT 'aktif',
            olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            guncellenme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `
      },
      {
        name: 'urunler',
        sql: `
          CREATE TABLE IF NOT EXISTS urunler (
            id INT PRIMARY KEY AUTO_INCREMENT,
            urun_adi VARCHAR(255) NOT NULL,
            stok_miktari DECIMAL(10,2) DEFAULT 0,
            birim VARCHAR(50),
            min_stok DECIMAL(10,2) DEFAULT 0,
            olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            guncellenme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `
      },
      {
        name: 'stok_hareketleri',
        sql: `
          CREATE TABLE IF NOT EXISTS stok_hareketleri (
            id INT PRIMARY KEY AUTO_INCREMENT,
            urun_id INT,
            hareket_tipi ENUM('giris', 'cikis') NOT NULL,
            miktar DECIMAL(10,2) NOT NULL,
            aciklama TEXT,
            tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (urun_id) REFERENCES urunler(id) ON DELETE CASCADE
          )
        `
      },
      {
        name: 'faturalar',
        sql: `
          CREATE TABLE IF NOT EXISTS faturalar (
            id INT PRIMARY KEY AUTO_INCREMENT,
            fatura_no VARCHAR(50) UNIQUE NOT NULL,
            musteri_adi VARCHAR(255) NOT NULL,
            tutar DECIMAL(10,2) NOT NULL,
            fatura_tipi ENUM('alis', 'satis') NOT NULL,
            aciklama TEXT,
            tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            guncellenme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `
      },
      {
        name: 'irsaliyeler',
        sql: `
          CREATE TABLE IF NOT EXISTS irsaliyeler (
            id INT PRIMARY KEY AUTO_INCREMENT,
            irsaliye_no VARCHAR(50) UNIQUE NOT NULL,
            musteri_adi VARCHAR(255) NOT NULL,
            aciklama TEXT,
            tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            guncellenme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `
      },
      {
        name: 'personel',
        sql: `
          CREATE TABLE IF NOT EXISTS personel (
            id INT PRIMARY KEY AUTO_INCREMENT,
            ad VARCHAR(100) NOT NULL,
            soyad VARCHAR(100) NOT NULL,
            tc_no VARCHAR(11) UNIQUE,
            telefon VARCHAR(20),
            email VARCHAR(100) UNIQUE,
            pozisyon VARCHAR(100),
            maas DECIMAL(10,2),
            ise_giris_tarihi DATE,
            olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            guncellenme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `
      },
      {
        name: 'izinler',
        sql: `
          CREATE TABLE IF NOT EXISTS izinler (
            id INT PRIMARY KEY AUTO_INCREMENT,
            personel_id INT,
            izin_tipi ENUM('yillik', 'hastalik', 'mazeret') NOT NULL,
            baslangic_tarihi DATE NOT NULL,
            bitis_tarihi DATE NOT NULL,
            aciklama TEXT,
            olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (personel_id) REFERENCES personel(id) ON DELETE CASCADE
          )
        `
      },
      {
        name: 'vardiyalar',
        sql: `
          CREATE TABLE IF NOT EXISTS vardiyalar (
            id INT PRIMARY KEY AUTO_INCREMENT,
            personel_id INT,
            tarih DATE NOT NULL,
            vardiya_tipi ENUM('sabah', 'oglen', 'gece') NOT NULL,
            baslangic_saati TIME,
            bitis_saati TIME,
            olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (personel_id) REFERENCES personel(id) ON DELETE CASCADE
          )
        `
      },
      {
        name: 'bordrolar',
        sql: `
          CREATE TABLE IF NOT EXISTS bordrolar (
            id INT PRIMARY KEY AUTO_INCREMENT,
            personel_id INT,
            donem VARCHAR(7) NOT NULL,
            brut_maas DECIMAL(10,2),
            kesintiler DECIMAL(10,2),
            net_maas DECIMAL(10,2),
            olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (personel_id) REFERENCES personel(id) ON DELETE CASCADE
          )
        `
      }
    ];

    for (const migration of migrations) {
      await connection.query(migration.sql);
      console.log(`✅ Tablo oluşturuldu: ${migration.name}`);
    }

    console.log('\n✨ Migration başarıyla tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration hatası:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.release();
  }
}

runMigrations();
