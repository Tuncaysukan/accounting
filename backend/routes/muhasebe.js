import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Faturaları listele
router.get('/faturalar', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM faturalar ORDER BY tarih DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Yeni fatura ekle
router.post('/faturalar', async (req, res) => {
  try {
    const { fatura_no, musteri_adi, tutar, fatura_tipi } = req.body;
    const [result] = await db.query(
      'INSERT INTO faturalar (fatura_no, musteri_adi, tutar, fatura_tipi) VALUES (?, ?, ?, ?)',
      [fatura_no, musteri_adi, tutar, fatura_tipi]
    );
    res.json({ id: result.insertId, message: 'Fatura oluşturuldu' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// İrsaliyeleri listele
router.get('/irsaliyeler', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM irsaliyeler ORDER BY tarih DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
