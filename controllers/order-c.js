import Order from '../models/order.js';
import * as orderService from '../services/order-s.js';
import db from '../db/db.js';

export const createOrder = async (req, res, next) => {
  try {
    const orderData = {
      ...req.body,
      user_id: req.user ? (req.user.id || req.user.user_id) : null 
    };
    const order = await orderService.createNewOrder(orderData);
    res.created(order, 'Đơn hàng linh kiện đã được khởi tạo!');
  } catch (err) { next(err); }
};

export const getOrderDetail = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const bill = await orderService.getOrderDetail(orderId);
    res.ok(bill);
  } catch (err) { next(err); }
};

export const verifyOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const result = await orderService.verifyOrder(orderId);
    res.ok(result); 
  } catch (err) { next(err); }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.user_id; 
    const orders = await orderService.getMyOrders(userId);
    res.list(orders, { count: orders.length, message: 'Lịch sử mua hàng của bạn' });
  } catch (err) { next(err); }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const orders = await Order.getAllOrders(status);
    res.list(orders, { count: orders.length, message: status ? `Danh sách đơn hàng ${status}` : 'Danh sách toàn bộ đơn hàng' });
  } catch (err) { next(err); }
};

// Hàm Hủy Đơn
export const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const result = await orderService.cancelOrder(orderId, req.user);
    res.status(200).json({ status: 'success', data: result });
  } catch (err) { next(err); }
};

// CÁCH 2: API Giao hàng (PENDING -> SHIPPED)
export const shipOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    await Order.updateOrderFields(orderId, { status: 'SHIPPED' });
    res.status(200).json({
      status: 'success',
      message: `Đã chuyển đơn hàng #${orderId} sang trạng thái SHIPPED (Đang giao hàng) thành công!`
    });
  } catch (err) { next(err); }
};

// CÁCH 2: API Chốt đơn (SHIPPED -> COMPLETED)
export const completeOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    await Order.updateOrderFields(orderId, { status: 'COMPLETED' });
    res.status(200).json({
      status: 'success',
      message: `Đã chốt đơn hàng #${orderId} thành công (Trạng thái: COMPLETED)!`
    });
  } catch (err) { next(err); }
};