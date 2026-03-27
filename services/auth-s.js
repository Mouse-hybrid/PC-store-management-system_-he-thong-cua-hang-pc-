import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import Customer from '../models/customer.js';
import RefreshToken from '../models/refresh-token.js';
import AppError from '../utils/appError.js';
import db from '../db/db.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

export const signup = async (userData) => {
  const { username, email, password, full_name, phone_number, address, role = 'MEMBER' } = userData;
  
  return await db.transaction(async (trx) => {
    // 1. Kiểm tra username đã tồn tại chưa
    const existingUser = await trx('users').where({ username }).first();
    if (existingUser) throw new AppError('Tên đăng nhập đã tồn tại', 400);

    // 2. Hash mật khẩu và insert vào bảng users
    const password_hash = await bcrypt.hash(password, 12);
    const [userId] = await trx('users').insert({ username, email, password_hash, role });

    // 3. Phân nhánh lưu Profile theo ĐÚNG Role
    if (role === 'MEMBER') {
      await trx('customer_profiles').insert({ 
        user_id: userId, 
        full_name: full_name,
        phone_number: phone_number,
        shipping_address: address || null
      });
    } else if (role === 'STAFF' || role === 'ADMIN') {
      // Lưu vào bảng nhân viên
      await trx('staff_profiles').insert({ 
        user_id: userId, 
        full_name: full_name,
        phone_number: phone_number,
        salary: 5000000 // Set mức lương cơ bản ban đầu
      });
    }
    
    return { userId, username, role };
  });
};

export const login = async (username, password) => {
  // 1. Tự động cắt bỏ khoảng trắng vô tình bị dính vào khi gõ/paste
  const cleanUsername = username.trim();
  const cleanPassword = password.trim();

  // 2. Tìm user bằng username HOẶC email
  const user = await db('users')
    .where('username', cleanUsername)
    .orWhere('email', cleanUsername)
    .first();

  // 👉 TÁCH LỖI 1: Báo cho Frontend biết nếu không tìm thấy User
  if (!user) {
    throw new AppError('Tài khoản hoặc Email này không tồn tại trên hệ thống!', 401);
  }

  // 3. Kiểm tra mật khẩu (Hỗ trợ cả bcrypt lẫn pass chưa mã hóa để phòng hờ)
  const isBcryptMatch = await bcrypt.compare(cleanPassword, user.password_hash);
  const isPlainMatch = cleanPassword === user.password_hash;

  // 👉 TÁCH LỖI 2: Báo cho Frontend biết nếu tìm thấy User nhưng sai Pass
  if (!isBcryptMatch && !isPlainMatch) {
    throw new AppError('Mật khẩu bạn nhập không chính xác!', 401);
  }

  // 4. 👉 SỬA LỖI KHÓA CHÍNH: Lấy đúng ID dù CSDL đặt tên là 'id' hay 'user_id'
  const userId = user.user_id || user.id; 

  const accessToken = signToken(userId);
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  // Xóa Refresh Token cũ của user này
  await RefreshToken.deleteByUser(userId); 
  
  // Lưu Refresh Token mới
  await RefreshToken.save(userId, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  return { accessToken, refreshToken, user: { id: userId, username: user.username, role: user.role } };
};

// Bổ sung vào auth-s.js
export const logout = async (userId) => {
    // Xóa toàn bộ refresh tokens của user này khi đăng xuất
    await RefreshToken.deleteByUser(userId);
    return true;
  };