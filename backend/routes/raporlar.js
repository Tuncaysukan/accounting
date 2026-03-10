import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Stok raporu
router.get('/stok', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT urun_adi, stok_miktari, min_stok,
      CASE WHEN stok_miktari < min_stok THEN 'Kritik' ELSE 'Normal' END as durum
      FROM urunler
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Finansal rapor
router.get('/finansal', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        fatura_tipi,
        COUNT(*) as adet,
        SUM(tutar) as toplam
      FROM faturalar
      GROUP BY fatura_tipi
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Personel raporu
router.get('/personel', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.ad, p.soyad,
        COUNT(i.id) as izin_sayisi,
        COUNT(v.id) as vardiya_sayisi
      FROM personel p
      LEFT JOIN izinler i ON p.id = i.personel_id
      LEFT JOIN vardiyalar v ON p.id = v.personel_id
      GROUP BY p.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
