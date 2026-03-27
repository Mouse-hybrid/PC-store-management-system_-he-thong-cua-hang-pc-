exports.isAdmin = (req, res, next) => {
  // req.user được tạo ra từ verifyToken (authMiddleware.js)
  if (req.user && req.user.role === 'admin') {
    next(); // Nếu là admin thì cho qua
  } else {
    return res.status(403).json({ message: 'Từ chối truy cập: Bạn không có quyền Admin!' });
  }
};