import db from '../db/db.js';

class Coupon {
  static async getDiscount(total, code) {
    const result = await db.raw('SELECT f_calculate_discount_amount(?, ?) AS discount', [total, code]);
    return result[0][0].discount;
  }

  // THÊM: Lưu mã mới vào DB
  static async create(couponData) {
    return db('coupons').insert(couponData);
  }

  // THÊM: Đổi trạng thái Bật/Tắt
  static async toggleStatus(code) {
    // Tìm xem mã này có tồn tại không
    const coupon = await db('coupons').where('code', code).first();
    if (!coupon) return null;

    // Đảo ngược trạng thái (đang true thành false, đang false thành true)
    await db('coupons')
      .where('code', code)
      .update({ is_active: !coupon.is_active });

    return !coupon.is_active; // Trả về trạng thái mới
  }
}
export default Coupon;