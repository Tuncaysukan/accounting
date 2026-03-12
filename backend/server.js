import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stokRoutes from './routes/stok.js';
import muhasebeRoutes from './routes/muhasebe.js';
import personelRoutes from './routes/personel.js';
import raporlarRoutes from './routes/raporlar.js';
import authRoutes from './routes/auth.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/stok', authenticateToken, stokRoutes);
app.use('/api/muhasebe', authenticateToken, muhasebeRoutes);
app.use('/api/personel', authenticateToken, personelRoutes);
app.use('/api/raporlar', authenticateToken, raporlarRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Stok ve Muhasebe API' });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
