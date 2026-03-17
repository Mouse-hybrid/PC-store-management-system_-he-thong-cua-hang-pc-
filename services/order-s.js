import Order from '../models/order.js';
import AppError from '../utils/appError.js';

export const createNewOrder = async (orderData) => {
  // Thực thi thủ tục an toàn trong DB (đã bao gồm trừ kho và gán Serial)
  const result = await Order.createOrder({
    name: orderData.guest_name,
    phone: orderData.guest_phone,
    address: orderData.shipping_address,
    productId: orderData.product_id,
    quantity: orderData.quantity
  });

  if (result.status === 'ERROR') {
    throw new AppError(result.message || 'Lỗi kho hàng hoặc sản phẩm không đủ', 400);
  }

  // Truy vấn View để lấy hóa đơn chuyên nghiệp
  const billInfo = await Order.getBill(result.new_order_id);
  return { 
    order_id: result.new_order_id, 
    items: billInfo,
    total: billInfo.reduce((acc, item) => acc + parseFloat(item.total_line_price), 0)
  };
};