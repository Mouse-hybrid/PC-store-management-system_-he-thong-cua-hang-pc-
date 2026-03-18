import db from '../db/db.js';

class Order {
  static async createOrder({ userId, name, phone, address, productId, quantity }) {
  // Đảm bảo có đủ 6 dấu ? và userId đứng đầu
  const rawResponse = await db.raw('CALL sp_create_order_safe(?, ?, ?, ?, ?, ?)', [
    userId, // Tham số thứ 1
    name,   // 2
    phone,  // 3
    address,// 4
    productId, // 5
    quantity   // 6
  ]);

    const rows = rawResponse[0];
    const resultSet = rows.find(item => Array.isArray(item));

    if (resultSet && resultSet.length > 0) {
      return resultSet[0]; 
    }
    return { status: 'ERROR', message: 'Không thể xử lý phản hồi từ Database' };
  }

  static async getBill(orderId) {
    return db('v_bill_details').where('order_id', orderId); 
  }
  // THÊM: Hàm cập nhật linh hoạt để lưu userId và status
  static async updateOrderFields(orderId, fields) {
    return db('orders')
      .where('order_id', orderId)
      .update(fields);
  }

  static async updateOrderStatus(orderId, status) {
    return db('orders')
      .where('order_id', orderId)
      .update({ status: status });
  }
}
export default Order;