const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // Lấy token từ header Authorization của request
  const authHeader = req.headers.authorization;

  // Kiểm tra xem có token không và có bắt đầu bằng chữ 'Bearer ' không
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Từ chối truy cập: Không tìm thấy token xác thực!' });
  }

  // Cắt bỏ chữ 'Bearer ' để lấy chuỗi token gốc
  const token = authHeader.split(' ')[1];

  try {
    // Dùng JWT_SECRET trong .env để giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Gắn thông tin vừa giải mã (userId, role) vào req để các hàm phía sau sử dụng
    req.user = decoded; 
    
    // Cho phép đi qua chốt chặn
    next(); 
  } catch (error) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};