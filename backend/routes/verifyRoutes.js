import express from 'express';
import { verifyLeetcodeToken } from '../controllers/verifyController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/check', protect, verifyLeetcodeToken);

export default router;
