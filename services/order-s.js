import Order from '../models/order.js';
import AppError from '../utils/appError.js';

export const createNewOrder = async (orderData) => {
 try {
    const result = await Order.createOrder({
      // Chỉ gửi 5 tham số cho SQL
      userId: orderData.user_id, // ĐÃ THÊM DÒNG NÀY
      name: orderData.guest_name,
      phone: orderData.guest_phone,
      address: orderData.shipping_address,
      productId: orderData.product_id,
      quantity: orderData.quantity
    });

    // Xử lý lỗi mềm (nếu Procedure trả về status: ERROR)
    if (result && result.status === 'ERROR') {
      throw new AppError(result.message || 'Lỗi kho hàng', 400);
    }

    await Order.updateOrderFields(result.new_order_id, {
      user_id: orderData.user_id,
      status: 'PENDING'
    });

    const billInfo = await Order.getBill(result.new_order_id);
    
    return { 
      order_id: result.new_order_id, 
      items: billInfo.map(item => ({
        ...item,
        total_line_price: item.total_line_price || result.final_amount 
      })),
      total: result.final_amount 
    };

  } catch (error) {
    // SỬA TẠI ĐÂY: Bắt lỗi cứng từ MySQL (Knex) và biến nó thành lỗi 400 thân thiện
    if (error.message && error.message.includes('Không đủ hàng tồn kho')) {
      throw new AppError('Không đủ hàng tồn kho để bán!', 400);
    }
    
    // Nếu là lỗi khác, cứ ném đi tiếp để hệ thống xử lý
    throw error;
  }
};

export const getOrderDetail = async (orderId) => {
  const billInfo = await Order.getBill(orderId);
  if (!billInfo || billInfo.length === 0) {
    throw new AppError('Không tìm thấy đơn hàng hoặc đơn hàng trống', 404);
  }
  return billInfo;

};

export const verifyOrder = async (orderId) => {
  // 1. Kiểm tra đơn hàng có tồn tại không thông qua View
  const order = await Order.getBill(orderId);
  if (!order || order.length === 0) {
    throw new AppError('Không tìm thấy đơn hàng để xác thực', 404);
  }

  // 2. Cập nhật trạng thái sang COMPLETED
  await Order.updateOrderStatus(orderId, 'COMPLETED');

  return {
    message: `Đơn hàng #${orderId} đã được Staff xác thực thành công!`,
    status: 'COMPLETED'
  };
};