import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import verifyRoutes from './routes/verifyRoutes.js';
import mapRoutes from './routes/mapRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Render will use CLIENT_URL, local uses 5173
  credentials: true 
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'LeetCode Territory Backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/map', mapRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
