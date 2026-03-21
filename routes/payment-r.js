import express from 'express';
import { getPaymentMethods, handlePaymentWebhook } from '../controllers/payment-c.js';
import { protect } from '../middlewares/auth-mw.js';

const router = express.Router();

// Lấy danh sách phương thức (COD, MOMO...)
router.get('/methods', protect, getPaymentMethods);

// THÊM DÒNG NÀY: API để các cổng thanh toán gọi về cập nhật trạng thái
// Lưu ý: Webhook thường không dùng 'protect' vì nó được gọi từ server của MoMo/VNPay chứ không phải từ User
router.post('/webhook', handlePaymentWebhook);

export default router;