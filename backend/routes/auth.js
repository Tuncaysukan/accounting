import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { kullanici_adi, sifre } = req.body;

    if (!kullanici_adi || !sifre) {
      return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
    }

    // Kullanıcıyı bul
    const [users] = await db.query(
      'SELECT * FROM kullanicilar WHERE kullanici_adi = ? AND durum = "aktif"',
      [kullanici_adi]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı' });
    }

    const user = users[0];

    // Şifreyi kontrol et
    const sifreDogruMu = await bcrypt.compare(sifre, user.sifre);
    if (!sifreDogruMu) {
      return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı' });
    }

    // Token oluştur
    const token = jwt.sign(
      {
        id: user.id,
        kullanici_adi: user.kullanici_adi,
        rol: user.rol,
        ad_soyad: user.ad_soyad
      },
      process.env.JWT_SECRET || 'gizli_anahtar_2024',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        kullanici_adi: user.kullanici_adi,
        ad_soyad: user.ad_soyad,
        rol: user.rol,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login hatası:', error);
    res.status(500).json({ error: 'Giriş yapılamadı' });
  }
});

// Kullanıcı bilgisi
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar_2024');
    const [users] = await db.query('SELECT * FROM kullanicilar WHERE id = ?', [decoded.id]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const user = users[0];
    res.json({
      id: user.id,
      kullanici_adi: user.kullanici_adi,
      ad_soyad: user.ad_soyad,
      rol: user.rol,
      email: user.email
    });
  } catch (error) {
    res.status(401).json({ error: 'Geçersiz token' });
  }
});

// Şifre değiştir
router.post('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar_2024');
    const { eski_sifre, yeni_sifre } = req.body;

    if (!eski_sifre || !yeni_sifre) {
      return res.status(400).json({ error: 'Eski ve yeni şifre gerekli' });
    }

    const [users] = await db.query('SELECT * FROM kullanicilar WHERE id = ?', [decoded.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const user = users[0];
    const sifreDogruMu = await bcrypt.compare(eski_sifre, user.sifre);
    if (!sifreDogruMu) {
      return res.status(401).json({ error: 'Eski şifre hatalı' });
    }

    const hashedPassword = await bcrypt.hash(yeni_sifre, 10);
    await db.query('UPDATE kullanicilar SET sifre = ? WHERE id = ?', [hashedPassword, decoded.id]);

    res.json({ message: 'Şifre başarıyla değiştirildi' });
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    res.status(500).json({ error: 'Şifre değiştirilemedi' });
  }
});

export default router;
