import * as couponService from '../services/coupon-s.js';
import Coupon from '../models/coupon.js'; //  Coupon Model
import AppError from '../utils/appError.js'; // AppError để trả về lỗi 404

export const checkDiscount = async (req, res, next) => {
  try {
    const { totalAmount, code } = req.body;
    const result = await couponService.validateAndCalculateDiscount(totalAmount, code);
    res.ok(result, 'Áp dụng mã giảm giá thành công');
  } catch (err) {
    next(err);
  }
};

// Thay thế hàm createCoupon cũ bằng đoạn này:
export const createCoupon = async (req, res, next) => {
  try {
    // 1. Nhận expired_date từ Zod thay vì valid_until
    const { coupon_code, discount_value, expired_date, ...otherData } = req.body;
    
    const dbData = {
      code: coupon_code, 
      value: discount_value, 
      type: 'FIXED', 
      valid_until: expired_date, // 2. "Dịch" ngược lại thành valid_until cho MySQL hiểu
      ...otherData
    };

    await Coupon.create(dbData);
    res.created(null, `Đã tạo mã giảm giá ${coupon_code} thành công!`);
  } catch (err) {
    next(err);
  }
};

// THÊM: Xử lý công tắc Bật/Tắt mã
export const toggleCouponStatus = async (req, res, next) => {
  try {
    const { code } = req.params;
    const newStatus = await Coupon.toggleStatus(code);

    if (newStatus === null) {
      throw new AppError('Không tìm thấy mã giảm giá này!', 404);
    }

    res.ok(null, `Đã ${newStatus ? 'MỞ' : 'KHÓA'} mã giảm giá ${code} thành công!`);
  } catch (err) {
    next(err);
  }
};

export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await couponService.getAllCoupons();
    
    res.status(200).json({
      status: 'success',
      message: 'Lấy danh sách mã giảm giá thành công',
      data: coupons
    });
  } catch (err) {
    next(err);
  }
};