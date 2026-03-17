/**
 * Chuẩn hóa cấu trúc phản hồi JSON
 * @param {object} res - Express Response object
 * @param {number} statusCode - HTTP status code (200, 201...)
 * @param {any} data - Dữ liệu cần trả về
 * @param {string} message - Thông báo kèm theo
 * @param {object} meta - Thông tin bổ sung (phân trang, requestId...)
 */
export const sendResponse = (res, statusCode, data, message = 'Success', meta = {}) => {
  // Trích xuất requestId từ res.locals hoặc req (nếu có) để đồng bộ với Log
  const requestId = res.locals.requestId || undefined;

  res.status(statusCode).json({
    status: 'success',
    message,
    data,
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
      ...meta,
    },
    error: null,
  });
};