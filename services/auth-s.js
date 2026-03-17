import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import Customer from '../models/customer.js';
import RefreshToken from '../models/refresh-token.js';
import AppError from '../utils/appError.js';
import db from '../db/db.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

export const signup = async (userData) => {
  const { username, email, password, full_name, role = 'MEMBER', phone_number, address } = userData;
  
  // Dùng Transaction để đảm bảo nếu tạo Profile lỗi thì User cũng không được tạo
  return await db.transaction(async (trx) => {
    const existingUser = await User.findByUsername(username);
    if (existingUser) throw new AppError('Tên đăng nhập đã tồn tại', 400);

    const password_hash = await bcrypt.hash(password, 12);
    const [userId] = await trx('users').insert({ username, email, password_hash, role });

    // Nếu là MEMBER, tạo thêm thông tin khách hàng
    if (role === 'MEMBER') {
      await trx('customers').insert({ user_id: userId, full_name, phone_number, address });
    }
    
    return { userId, username, role };
  });
};

export const login = async (username, password) => {
  const user = await User.findByUsername(username);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError('Tên đăng nhập hoặc mật khẩu không chính xác', 401);
  }

  const accessToken = signToken(user.user_id);
  const refreshToken = jwt.sign({ id: user.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  // Lưu Refresh Token để quản lý phiên
  await RefreshToken.save(user.user_id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  return { accessToken, refreshToken, user: { id: user.user_id, username: user.username, role: user.role } };
};

// Bổ sung vào auth-s.js
export const logout = async (userId) => {
    // Xóa toàn bộ refresh tokens của user này khi đăng xuất
    await RefreshToken.deleteByUser(userId);
    return true;
  };