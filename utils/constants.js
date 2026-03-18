// Quyền hạn người dùng - Khớp với Enum trong DB
export const ROLES = {
    ADMIN: 'ADMIN',
    STAFF: 'STAFF',
    MEMBER: 'MEMBER'
  };
  
  // Trạng thái đơn hàng - Quy trình vận hành của PC Store
  export const ORDER_STATUS = {
    PENDING: 'PENDING',       // Khách vừa đặt
    PROCESSING: 'PROCESSING', // Nhân viên đang đóng gói linh kiện
    SHIPPED: 'SHIPPED',       // Đang giao hàng
    DELIVERED: 'DELIVERED',   // Đã nhận hàng & Hoàn tất
    CANCELLED: 'CANCELLED'    // Đã hủy (Hoàn kho)
  };
  
  // Trạng thái thanh toán
  export const PAYMENT_STATUS = {
    WAITING: 'WAITING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED'
  };
  
  // Các phương thức thanh toán hỗ trợ
  export const PAYMENT_METHODS = {
    CASH: 'CASH',
    BANK_TRANSFER: 'BANK_TRANSFER',
    MOMO: 'MOMO',
    VNPAY: 'VNPAY'

     
  };
  // --- BỔ SUNG ĐỂ ĐỒNG BỘ HỆ THỐNG ---
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12 // 12 sản phẩm mỗi trang là đẹp cho giao diện Grid
};

export const FILE_LIMITS = {
  MAX_PRODUCT_IMAGES: 5,
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp']
};
export const HTTP_STATUS = {
  // 2xx: Thành công
  OK: 200,
  CREATED: 201,      // Dùng khi tạo mới Đơn hàng/Sản phẩm
  NO_CONTENT: 204,   // Dùng cho Đăng xuất (Logout)

  // 3xx: Chuyển hướng / Caching
  NOT_MODIFIED: 304, // Dùng khi dữ liệu linh kiện không thay đổi (tối ưu băng thông)

  // 4xx: Lỗi phía Khách hàng
  BAD_REQUEST: 400,  // Dữ liệu gửi lên sai định dạng (Zod/Joi error)
  UNAUTHORIZED: 401, // Chưa đăng nhập hoặc Token sai/hết hạn
  FORBIDDEN: 403,    // Đã đăng nhập nhưng không có quyền (Member vào khu vực Admin)
  NOT_FOUND: 404,    // Không tìm thấy sản phẩm/đơn hàng
  CONFLICT: 409,     // Trùng lặp dữ liệu (Email/SKU đã tồn tại)

  // 5xx: Lỗi phía Server
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503 // Server đang bảo trì hoặc quá tải
};