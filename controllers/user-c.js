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
    const role = req.user.role?.toUpperCase();

    let query = db('users as u').where('u.user_id', userId);

    // Dựa vào quyền để JOIN lấy Tên và Số điện thoại
    if (role === 'MEMBER') {
      query = query.leftJoin('customer_profiles as cp', 'u.user_id', 'cp.user_id')
                   .select('u.username', 'u.email', 'u.role', 'u.is_active', 'cp.full_name', 'cp.phone_number', 'cp.shipping_address as address');
    } else {
      query = query.leftJoin('staff_profiles as sp', 'u.user_id', 'sp.user_id')
                   .select('u.username', 'u.email', 'u.role', 'u.is_active', 'sp.full_name', 'sp.phone_number');
    }

    const user = await query.first();

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
    const users = await db('users as u')
      .select(
        'u.user_id', 'u.username', 'u.email', 'u.role', 'u.is_active', 'u.created_at',
        'cp.full_name', 'cp.phone_number', 'cp.shipping_address'
      )
      .leftJoin('customer_profiles as cp', 'u.user_id', 'cp.user_id') // JOIN để lấy thông tin chi tiết
      .orderBy('u.created_at', 'desc'); 

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

// controllers/user-c.js
export const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.user_id;
    const userRole = req.user.role?.toUpperCase(); 
    const { fullName, email, phone, address } = req.body; 

    await db.transaction(async (trx) => {
      
      // 1. Cập nhật Email (Bảng users)
      if (email) {
        await trx('users').where('user_id', userId).update({ email: email });
      }

      // 2. Cập nhật Profile tùy theo Role
      if (userRole === 'MEMBER') {
        const updateData = {};
        if (fullName !== undefined) updateData.full_name = fullName;
        if (phone !== undefined) updateData.phone_number = phone;
        if (address !== undefined) updateData.shipping_address = address;

        if (Object.keys(updateData).length > 0) {
          // Bắt lỗi tài khoản tạo thủ công
          const existing = await trx('customer_profiles').where('user_id', userId).first();
          if (existing) {
            await trx('customer_profiles').where('user_id', userId).update(updateData);
          } else {
            await trx('customer_profiles').insert({ user_id: userId, ...updateData });
          }
        }

      } else if (userRole === 'STAFF' || userRole === 'ADMIN') {
        const updateData = {};
        if (fullName !== undefined) updateData.full_name = fullName;
        if (phone !== undefined) updateData.phone_number = phone;

        if (Object.keys(updateData).length > 0) {
          // 👉 FIX LỖI TẠI ĐÂY: Nếu Admin chưa có profile, hệ thống tự động tạo mới!
          const existing = await trx('staff_profiles').where('user_id', userId).first();
          if (existing) {
            await trx('staff_profiles').where('user_id', userId).update(updateData);
          } else {
            await trx('staff_profiles').insert({ user_id: userId, ...updateData, salary: 0 });
          }
        }
      }
    });

    res.status(200).json({ 
      status: 'success', 
      message: 'Cập nhật hồ sơ cá nhân thành công!' 
    });
  } catch (error) { 
    next(error); 
  }
};