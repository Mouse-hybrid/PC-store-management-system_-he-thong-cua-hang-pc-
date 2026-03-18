import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import AppError from '../utils/appError.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) return next(new AppError('Bạn chưa đăng nhập!', 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id); // Đồng bộ với pro_id/user_id

    if (!currentUser || !currentUser.is_active) {
      return next(new AppError('Người dùng không còn tồn tại hoặc bị khóa.', 401));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(new AppError('Token không hợp lệ hoặc đã hết hạn.', 401));
  }
};

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        // ADMIN luôn có quyền vượt qua các lớp restrictTo thông thường
        if (req.user.role !== 'ADMIN' && !roles.includes(req.user.role)) {
          return next(new AppError('Bạn không có quyền thực hiện hành động này.', 403));
        }
        next();
      };
    };