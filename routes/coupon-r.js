import express from 'express';
import * as couponController from '../controllers/coupon-c.js';
import { validate } from '../middlewares/validate-mw.js';
import { couponSchema } from '../validators/coupon-schema.js';

const router = express.Router();

/**
 * @swagger
 * /coupons/check:
 * post:
 * summary: Kiểm tra mã giảm giá
 * tags: [Coupons]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * properties:
 * code: { type: string }
 * amount: { type: number }
 * responses:
 * 200:
 * description: Số tiền được giảm sau khi áp dụng mã
 */
router.post('/check', validate(couponSchema), couponController.checkDiscount);

export default router;