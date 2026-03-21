import User from '../models/user.js';
import AppError from '../utils/appError.js';
import db from '../db/db.js';

export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.user_id || req.user.id; 
    const profile = await User.getProfile(userId, req.user.role);
    
    if (!profile) return next(new AppError('Không tìm thấy hồ sơ', 404));

    res.ok(profile, 'Tải thông tin cá nhân thành công');
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.user_id;
    
    // Tìm user trong DB, chỉ select các trường an toàn để trả về Frontend
    const user = await db('users')
      .select('username', 'email', 'role', 'is_active')
      .where('user_id', userId) // (Nếu khóa chính bảng users của bạn là 'user_id' thì sửa lại nhé)
      .first();

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'Không tìm thấy người dùng!' });
    }

    res.ok(user, 'Lấy thông tin cá nhân thành công');
  } catch (err) {
    next(err);
  }
};