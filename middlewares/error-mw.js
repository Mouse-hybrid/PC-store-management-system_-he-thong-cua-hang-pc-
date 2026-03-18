import logger from '../logging/logger.js';

const handleDbError = (err) => {
  if (err.code === 'ER_DUP_ENTRY') return new AppError('Dữ liệu đã tồn tại trong hệ thống (Trùng mã/SKU/Email)!', 400);
  if (err.code === 'ER_NO_REFERENCED_ROW_2') return new AppError('Dữ liệu liên quan không tồn tại (Lỗi khóa ngoại)!', 400);
  return err;
};

export const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  // Xử lý riêng cho các lỗi từ Database PC Store
  if (err.code) error = handleDbError(err);

  logger.error({
    requestId: req.requestId,
    message: error.message,
    code: err.code, // Ghi lại mã lỗi MySQL để debug
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Đảm bảo status code luôn luôn là một con số, nếu bị undefined thì ép về 500
  const finalStatusCode = error.statusCode || 500;

  res.status(finalStatusCode).json({
    status: error.status || 'error',
    code: finalStatusCode,
    requestId: req.requestId,
    message: error.message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { error: err, stack: err.stack })
  });
};