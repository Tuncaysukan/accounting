import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const kullanicilar = [
  {
    kullanici_adi: 'admin',
    sifre: 'admin123',
    rol: 'admin',
    ad: 'Sistem',
    soyad: 'Yöneticisi',
    email: 'admin@sirket.com',
  },
  {
    kullanici_adi: 'muhasebe',
    sifre: 'muhasebe123',
    rol: 'muhasebe',
    ad: 'Muhasebe',
    soyad: 'Uzmanı',
    email: 'muhasebe@sirket.com',
  },
  {
    kullanici_adi: 'stok',
    sifre: 'stok123',
    rol: 'stok',
    ad: 'Stok',
    soyad: 'Sorumlusu',
    email: 'stok@sirket.com',
  },
  {
    kullanici_adi: 'ik',
    sifre: 'ik123',
    rol: 'ik',
    ad: 'İnsan Kaynakları',
    soyad: 'Uzmanı',
    email: 'ik@sirket.com',
  },
];

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'stok_muhasebe',
  });

  try {
    console.log('Seeder başlatılıyor...');

    for (const k of kullanicilar) {
      const hash = await bcrypt.hash(k.sifre, 10);

      await connection.query(
        `INSERT INTO kullanicilar (kullanici_adi, sifre, rol, ad, soyad, email)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           sifre = VALUES(sifre),
           rol = VALUES(rol),
           ad = VALUES(ad),
           soyad = VALUES(soyad),
           email = VALUES(email)`,
        [k.kullanici_adi, hash, k.rol, k.ad, k.soyad, k.email]
      );

      console.log(`  ✓ ${k.rol} hesabı oluşturuldu: ${k.kullanici_adi} / ${k.sifre}`);
    }

    console.log('\nSeeder tamamlandı.');
  } catch (err) {
    console.error('Seeder hatası:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
