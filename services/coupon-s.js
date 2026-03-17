import Coupon from '../models/coupon.js';

export const validateAndCalculateDiscount = async (totalAmount, code) => {
  const discount = await Coupon.getDiscount(totalAmount, code);
  return {
    originalAmount: totalAmount,
    discountAmount: parseFloat(discount),
    finalAmount: totalAmount - parseFloat(discount)
  };
};