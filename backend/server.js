import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stokRoutes from './routes/stok.js';
import muhasebeRoutes from './routes/muhasebe.js';
import personelRoutes from './routes/personel.js';
import raporlarRoutes from './routes/raporlar.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stok', stokRoutes);
app.use('/api/muhasebe', muhasebeRoutes);
app.use('/api/personel', personelRoutes);
app.use('/api/raporlar', raporlarRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Stok ve Muhasebe API' });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
