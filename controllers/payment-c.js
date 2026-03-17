import * as paymentService from '../services/payment-s.js';
import { PAYMENT_METHODS } from '../utils/constants.js';

export const handlePaymentWebhook = async (req, res, next) => {
  try {
    const { paymentId, status, transactionCode } = req.body;
    // Cập nhật trạng thái thanh toán từ cổng MoMo/VNPay/Stripe
    const result = await paymentService.processPaymentWebhook(paymentId, status, transactionCode);
    res.ok(result, 'Cập nhật trạng thái thanh toán thành công');
  } catch (err) {
    next(err);
  }
};

export const getPaymentMethods = async (req, res, next) => {
  try {
    const methods = Object.values(PAYMENT_METHODS);
    res.ok(methods, 'Lấy danh sách phương thức thanh toán thành công');
  } catch (err) {
    next(err);
  }
};