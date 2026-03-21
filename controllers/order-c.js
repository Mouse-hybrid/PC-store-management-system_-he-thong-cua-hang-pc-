import Order from '../models/order.js';
import * as orderService from '../services/order-s.js';
import db from '../db/db.js';

export const createOrder = async (req, res, next) => {
  try {
    // Nếu khách đã đăng nhập, ưu tiên dùng thông tin từ hồ sơ user
    const orderData = {
      ...req.body,
      user_id: req.user ? (req.user.id || req.user.user_id) : null 
    };

    const order = await orderService.createNewOrder(orderData);
    res.created(order, 'Đơn hàng linh kiện đã được khởi tạo!');
  } catch (err) {
    next(err);
  }
};

export const getOrderDetail = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const bill = await orderService.getOrderDetail(orderId); // Lấy dữ liệu từ View v_bill_details
    res.ok(bill);
  } catch (err) {
    next(err);
  }

};
// Đảm bảo có từ khóa 'export' ở đây!
export const verifyOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const result = await orderService.verifyOrder(orderId);
    res.ok(result); 
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const user = req.user; // Lấy thông tin user (role, id) từ middleware protect

    const result = await orderService.cancelOrder(orderId, user);
    res.ok(result);
  } catch (err) {
    next(err);
  }
};

// THÊM HÀM NÀY VÀO DƯỚI CÙNG FILE order-c.js
export const getMyOrders = async (req, res, next) => {
  try {
    // Lấy ID user từ token đã giải mã (middleware protect)
    // Tùy theo cách bạn gán payload lúc đăng nhập, thường là req.user.id hoặc req.user.user_id
    const userId = req.user.id || req.user.user_id; 
    
    const orders = await orderService.getMyOrders(userId);
    res.list(orders, { count: orders.length, message: 'Lịch sử mua hàng của bạn' });
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query; // Lấy bộ lọc từ URL (ví dụ: ?status=PENDING)
    const orders = await Order.getAllOrders(status);
    
    res.list(orders, { 
      count: orders.length, 
      message: status ? `Danh sách đơn hàng ${status}` : 'Danh sách toàn bộ đơn hàng' 
    });
  } catch (err) {
    next(err);
  }
};

// Bổ sung hàm này vào cuối file
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // Gửi lên 'COMPLETED' hoặc 'CANCELLED'

    // Cập nhật trạng thái
    const updated = await db('orders')
      .where({ order_id: orderId })
      .update({ status });

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy đơn hàng!' });
    }

    res.status(200).json({
      status: 'success',
      message: `Đã cập nhật đơn hàng #${orderId} thành ${status}`
    });
  } catch (err) {
    next(err);
  }
};