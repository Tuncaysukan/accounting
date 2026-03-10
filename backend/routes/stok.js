import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Tüm ürünleri listele
router.get('/urunler', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM urunler');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Yeni ürün ekle
router.post('/urunler', async (req, res) => {
  try {
    const { urun_adi, stok_miktari, birim, min_stok } = req.body;
    const [result] = await db.query(
      'INSERT INTO urunler (urun_adi, stok_miktari, birim, min_stok) VALUES (?, ?, ?, ?)',
      [urun_adi, stok_miktari, birim, min_stok]
    );
    res.json({ id: result.insertId, message: 'Ürün eklendi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stok hareketi ekle
router.post('/hareketler', async (req, res) => {
  try {
    const { urun_id, hareket_tipi, miktar, aciklama } = req.body;
    const [result] = await db.query(
      'INSERT INTO stok_hareketleri (urun_id, hareket_tipi, miktar, aciklama) VALUES (?, ?, ?, ?)',
      [urun_id, hareket_tipi, miktar, aciklama]
    );
    res.json({ id: result.insertId, message: 'Hareket kaydedildi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
