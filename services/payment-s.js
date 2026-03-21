import Payment from '../models/payment.js';
import Order from '../models/order.js';
import AppError from '../utils/appError.js';

export const processPaymentWebhook = async (paymentId, status, transactionCode) => {
  // 1. Tìm cục thanh toán này
  const payment = await Payment.getById(paymentId);
  if (!payment) throw new AppError('Không tìm thấy thông tin thanh toán', 404);

  // 2. Cập nhật bảng payments
  await Payment.updateStatus(paymentId, status, transactionCode);

  // 3. ĐỒNG BỘ: Nếu ting ting (SUCCESS), tự động đổi trạng thái đơn hàng luôn!
  if (status === 'SUCCESS') {
    // Chuyển đơn sang PROCESSING (Đang xử lý/Đóng gói)
    await Order.updateOrderStatus(payment.order_id, 'COMPLETED');
  }

  return { paymentId, status, order_id: payment.order_id };
};