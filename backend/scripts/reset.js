import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10
});

async function resetDatabase() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔄 Veritabanı sıfırlanıyor...\n');

    const dbName = process.env.DB_NAME || 'stok_muhasebe';

    // Veritabanı sil
    await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
    console.log(`✅ Veritabanı silindi: ${dbName}`);

    // Veritabanı oluştur
    await connection.query(`CREATE DATABASE ${dbName}`);
    console.log(`✅ Veritabanı oluşturuldu: ${dbName}`);

    console.log('\n✨ Veritabanı sıfırlandı!');
    console.log('\n💡 Sonraki adım: npm run migrate && npm run seed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Reset hatası:', error.message);
    process.exit(1);
  } finally {
    await connection.release();
    await pool.end();
  }
}

resetDatabase();
