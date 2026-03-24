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

// 👉 1. Lấy toàn bộ danh sách người dùng cho Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await db('users')
      .select('user_id', 'username', 'email', 'role', 'is_active')
      .orderBy('role', 'asc'); 

    res.status(200).json({ status: 'success', data: users });
  } catch (error) { next(error); }
};

// 👉 2. Khóa tài khoản người dùng
export const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db('users').where('user_id', id).update({ is_active: false }); // Hoặc status: 'deactivated' tùy DB của bạn
    res.status(200).json({ status: 'success', message: 'Tài khoản đã bị khóa!' });
  } catch (error) { next(error); }
};