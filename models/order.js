import db from '../db/db.js';

class Order {
  // LUỒNG CHÍNH: Gọi Procedure xử lý giao dịch an toàn
  static async createOrder({ name, phone, address, productId, quantity }) {
    const [rows] = await db.raw('CALL sp_create_order_safe(?, ?, ?, ?, ?)', [
      name, phone, address, productId, quantity
    ]);
    return rows[0][0]; // Trả về { status: 'SUCCESS', new_order_id: ... }
  }

  static async getBill(orderId) {
    return db('v_bill_details').where('order_id', orderId); // Lấy từ View
  }
}
export default Order;