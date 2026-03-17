import { sendResponse } from '../utils/response.js';

export const responseEnhancer = (req, res, next) => {
  // Trả về thành công chung (Status 200)
  res.ok = (data, message = 'Success') => {
    return sendResponse(res, 200, data, message, { requestId: req.requestId });
  };

  // Trả về khi tạo mới thành công (Status 201) - Dùng cho đơn hàng mới, sản phẩm mới
  res.created = (data, message = 'Created Successfully') => {
    return sendResponse(res, 201, data, message, { requestId: req.requestId });
  };

  // Trả về danh sách (Status 200) - Có thêm meta để sau này làm phân trang (Pagination)
  res.list = (data, meta = {}, message = 'Get list success') => {
    return sendResponse(res, 200, data, message, { 
      requestId: req.requestId,
      ...meta 
    });
  };

  next();
};