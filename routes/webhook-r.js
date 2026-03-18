import express from 'express';
import * as paymentController from '../controllers/payment-c.js';
import { validate } from '../middlewares/validate-mw.js';
import { paymentSchema } from '../validators/payment-schema.js';

const router = express.Router();

// Webhook cần Validate nghiêm ngặt để tránh giả mạo dữ liệu
router.post('/callback', validate(paymentSchema), paymentController.handlePaymentWebhook);

export default router;