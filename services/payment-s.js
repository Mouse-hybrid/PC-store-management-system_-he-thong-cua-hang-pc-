import Payment from '../models/payment.js';
import AppError from '../utils/appError.js';

export const processPaymentWebhook = async (paymentId, status, transactionCode) => {
  const updated = await Payment.updateStatus(paymentId, status, transactionCode);
  if (!updated) throw new AppError('Không tìm thấy thông tin thanh toán', 404);
  return { paymentId, status };
};