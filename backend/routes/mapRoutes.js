import express from 'express';
import { getNeighbors } from '../controllers/mapController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Fetch neighbors (protected route)
router.post('/neighbors', protect, getNeighbors);

export default router;
