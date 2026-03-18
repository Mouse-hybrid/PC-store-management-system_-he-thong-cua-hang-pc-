import * as orderService from '../services/order-s.js';

export const createOrder = async (req, res, next) => {
  try {
    // Nếu khách đã đăng nhập, ưu tiên dùng thông tin từ hồ sơ user
    const orderData = {
      ...req.body,
      user_id: req.user ? req.user.user_id : null 
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
<<<<<<< HEAD

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
=======
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
};