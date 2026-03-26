import express from 'express';
import { getPaymentMethods, handlePaymentWebhook } from '../controllers/payment-c.js';
import { protect } from '../middlewares/auth-mw.js';

const router = express.Router();

/**
 * @swagger
 * /payments/methods:
 * get:
 * summary: Lấy danh sách phương thức thanh toán hỗ trợ
 * tags: [Payments]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Danh sách phương thức (COD, MOMO...)
 */
router.get('/methods', protect, getPaymentMethods);

/**
 * @swagger
 * /payments/webhook:
 * post:
 * summary: Nhận IPN Webhook từ đối tác thanh toán (MoMo/VNPay)
 * tags: [Payments]
 * responses:
 * 200:
 * description: Xác nhận đã nhận tín hiệu
 */
router.post('/webhook', handlePaymentWebhook);

export default router;