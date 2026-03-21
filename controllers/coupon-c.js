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

// THÊM: Xử lý tạo mã mới
export const createCoupon = async (req, res, next) => {
  try {
  // Tách riêng coupon_code ra để đổi tên thành 'code'
    const { coupon_code, discount_value, ...otherData } = req.body;
    
    const dbData = {
      code: coupon_code, // Chuyển đổi tên cột cho khớp DB đã để
      value: discount_value, // đổi value thành discount_value cho chi tiết
      type: 'FIXED', // // Bổ sung thêm cột 'type' (Giảm giá cố định)
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