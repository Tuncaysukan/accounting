import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Personel listesi
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM personel');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// İzin kayıtları
router.get('/izinler', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, p.ad, p.soyad 
      FROM izinler i 
      JOIN personel p ON i.personel_id = p.id
      ORDER BY i.baslangic_tarihi DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vardiya listesi
router.get('/vardiyalar', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT v.*, p.ad, p.soyad 
      FROM vardiyalar v 
      JOIN personel p ON v.personel_id = p.id
      ORDER BY v.tarih DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
