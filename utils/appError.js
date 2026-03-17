class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
  
      this.statusCode = statusCode;
      // status là 'fail' cho lỗi 4xx (khách hàng sai) và 'error' cho lỗi 5xx (server sai)
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      
      // Đánh dấu đây là lỗi nghiệp vụ (mã giảm giá hết hạn, hết hàng...) 
      // chứ không phải lỗi crash server đột ngột.
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default AppError;