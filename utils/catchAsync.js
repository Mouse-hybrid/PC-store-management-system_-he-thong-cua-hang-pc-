/**
 * Bao bọc các hàm async trong Controller để tự động chuyển lỗi sang Error Middleware
 */
export default (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };