import * as couponService from '../services/coupon-s.js';

export const checkDiscount = async (req, res, next) => {
  try {
    const { totalAmount, code } = req.body;
    const result = await couponService.validateAndCalculateDiscount(totalAmount, code);
    res.ok(result, 'Áp dụng mã giảm giá thành công');
  } catch (err) {
    next(err);
  }
};