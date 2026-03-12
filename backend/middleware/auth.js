import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Yetkilendirme token\'ı gerekli' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar_2024', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Geçersiz token' });
    }
    req.user = user;
    next();
  });
}

export function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
    }

    next();
  };
}
