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
      quantity: orderData.quantity,
      coupon_code: orderData.coupon_code
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

export const getMyOrders = async (userId) => {
  if (!userId) {
    throw new AppError('Không tìm thấy thông tin người dùng!', 401);
  }
  const orders = await Order.getUserOrders(userId);
  return orders;
};

// xử lý staff và member khi cancel order
export const cancelOrder = async (orderId, user) => {
  // 1. Kiểm tra đơn hàng có tồn tại không
  const order = await Order.getOrderById(orderId);
  if (!order) {
    throw new AppError('Không tìm thấy đơn hàng!', 404);
  }

  // Nếu đơn đã hủy rồi thì chặn luôn
  if (order.status === 'CANCELLED') {
    throw new AppError('Đơn hàng này đã bị hủy trước đó rồi!', 400);
  }

  // 2. PHÂN QUYỀN VÀ LOGIC NGHIỆP VỤ
  
  // NẾU LÀ KHÁCH HÀNG (MEMBER)
  if (user.role === 'MEMBER') {
    // A. Chỉ được hủy đơn của chính mình
    // (Giả sử id của user lưu trong token là user.id hoặc user.user_id tùy code của bạn)
    const currentUserId = user.id || user.user_id; 
    if (order.user_id !== currentUserId) {
      throw new AppError('Bạn không có quyền hủy đơn hàng của người khác!', 403);
    }
    
    // B. Chỉ được hủy khi đơn đang PENDING
    if (order.status !== 'PENDING') {
      throw new AppError('Đơn hàng đã được xử lý hoặc đang giao, bạn không thể tự hủy. Vui lòng liên hệ Hotline!', 400);
    }
  }

  // NẾU LÀ NHÂN VIÊN (STAFF/ADMIN)
  // Nhân viên được quyền hủy ở mọi trạng thái (PENDING, COMPLETED lỡ nhầm, SHIPPED khách boom hàng)
  // Nên chúng ta không cần viết lệnh chặn (if) ở đây nữa.

  // 3. Tiến hành chuyển trạng thái sang CANCELLED
  // Ngay khi dòng này chạy xong, Trigger trg_restore_stock_cancel trong MySQL sẽ tự động:
  // - Cộng lại pro_quantity vào kho
  // - Đổi các Serial Number từ SOLD về IN_STOCK
  await Order.updateOrderStatus(orderId, 'CANCELLED');

  return {
    message: `Đơn hàng #${orderId} đã được hủy thành công. Kho hàng vật lý đã được hoàn trả!`,
    status: 'CANCELLED'
  };

  
};
