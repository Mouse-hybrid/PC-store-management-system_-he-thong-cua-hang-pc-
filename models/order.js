import db from '../db/db.js';

class Order {
  static async createOrder({ userId, name, phone, address, productId, quantity, coupon_code }) {
  // Đảm bảo có đủ 6 dấu ? và userId đứng đầu
  const rawResponse = await db.raw('CALL sp_create_order_safe(?, ?, ?, ?, ?, ?, ?)', [
    userId, // Tham số thứ 1
    name,   // 2
    phone,  // 3
    address,// 4
    productId, // 5
    quantity,   // 6
    coupon_code || null // 7
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

  // Lấy danh sách toàn bộ đơn hàng (Kèm bộ lọc trạng thái nếu có)
  static async getAllOrders(statusFilter) {
    let query = db('orders').orderBy('created_at', 'desc');
    
    // Nếu Frontend truyền lên ?status=PENDING thì lọc riêng PENDING
    if (statusFilter) {
      query = query.where('status', statusFilter);
    }
    return query;
  }

  // Lấy toàn bộ thông tin gốc của đơn hàng từ bảng orders
  static async getOrderById(orderId) {
    return db('orders').where('order_id', orderId).first();
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

  // Lấy danh sách đơn hàng của một user cụ thể
  static async getUserOrders(userId) {
    return db('orders')
      .where('user_id', userId)
      .orderBy('created_at', 'desc'); // Xếp đơn mới nhất lên đầu
  }
}
export default Order;