import express from 'express';
import * as paymentController from '../controllers/payment-c.js';
import { validate } from '../middlewares/validate-mw.js';
import { paymentSchema } from '../validators/payment-schema.js';

const router = express.Router();

/**
 * @swagger
 * /webhook/callback:
 * post:
 * summary: Xử lý callback thanh toán từ cổng thanh toán
 * tags: [Webhooks]
 * responses:
 * 200:
 * description: Nhận webhook thành công
 */
router.post('/callback', validate(paymentSchema), paymentController.handlePaymentWebhook);

export default router;