import express from 'express';
import * as couponController from '../controllers/coupon-c.js';
import { validate } from '../middlewares/validate-mw.js';
import { couponSchema, checkCouponSchema } from '../validators/coupon-schema.js';

import { protect, restrictTo } from '../middlewares/auth-mw.js'//phân quyền middleware cho import

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
 * totalAmount: { type: number }
 * responses:
 * 200:
 * description: Số tiền được giảm sau khi áp dụng mã
 */
router.post('/check', validate(checkCouponSchema), couponController.checkDiscount);

// THÊM: API Tạo mã mới (Chỉ Admin/Staff)
router.post('/', protect, restrictTo('ADMIN', 'STAFF'), validate(couponSchema), couponController.createCoupon);

// THÊM: API Khóa/Mở mã (Chỉ Admin/Staff)
router.patch('/:code/toggle', protect, restrictTo('ADMIN', 'STAFF'), couponController.toggleCouponStatus);

export default router;