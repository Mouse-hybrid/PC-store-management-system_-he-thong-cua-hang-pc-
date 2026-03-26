import express from 'express';
import * as couponController from '../controllers/coupon-c.js';
import { validate } from '../middlewares/validate-mw.js';
import { couponSchema, checkCouponSchema } from '../validators/coupon-schema.js';
import { protect, restrictTo } from '../middlewares/auth-mw.js';

const router = express.Router();

router.get('/', protect, restrictTo('ADMIN', 'STAFF'), couponController.getAllCoupons);
router.post('/check', validate(checkCouponSchema), couponController.checkDiscount);
router.post('/', protect, restrictTo('ADMIN', 'STAFF'), validate(couponSchema), couponController.createCoupon);
router.patch('/:code/toggle', protect, restrictTo('ADMIN', 'STAFF'), couponController.toggleCouponStatus);

export default router;