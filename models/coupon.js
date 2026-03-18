import db from '../db/db.js';

class Coupon {
  static async getDiscount(total, code) {
    const result = await db.raw('SELECT f_calculate_discount_amount(?, ?) AS discount', [total, code]); //
    return result[0][0].discount;
  }
}
export default Coupon;