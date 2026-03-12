import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { kullanici_adi, sifre } = req.body;

  if (!kullanici_adi || !sifre) {
    return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM kullanicilar WHERE kullanici_adi = ? AND aktif = 1',
      [kullanici_adi]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı' });
    }

    const kullanici = rows[0];
    const sifreGecerli = await bcrypt.compare(sifre, kullanici.sifre);

    if (!sifreGecerli) {
      return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı' });
    }

    const token = jwt.sign(
      {
        id: kullanici.id,
        kullanici_adi: kullanici.kullanici_adi,
        rol: kullanici.rol,
        ad: kullanici.ad,
        soyad: kullanici.soyad,
      },
      process.env.JWT_SECRET || 'gizli_anahtar_2024',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      kullanici: {
        id: kullanici.id,
        kullanici_adi: kullanici.kullanici_adi,
        rol: kullanici.rol,
        ad: kullanici.ad,
        soyad: kullanici.soyad,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authenticateToken, (req, res) => {
  res.json({ kullanici: req.kullanici });
});

export default router;
