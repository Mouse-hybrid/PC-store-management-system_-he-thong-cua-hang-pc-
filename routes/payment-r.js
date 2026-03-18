import express from 'express';
import { getPaymentMethods } from '../controllers/payment-c.js';
import { protect } from '../middlewares/auth-mw.js';

const router = express.Router();

// Lấy danh sách phương thức (COD, MOMO...) từ logic xử lý tập trung
router.get('/methods', protect, getPaymentMethods);

export default router;