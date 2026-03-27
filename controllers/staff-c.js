import Staff from '../models/staff.js';
import AppError from '../utils/appError.js';
import * as authService from '../services/auth-s.js';

export const updateStaffSalary = async (req, res, next) => {
  try {
    const { userId, salary } = req.body;
    // Đồng bộ với logic bảng staff trong Database
    const updated = await Staff.updateSalary(userId, salary);
    
    if (!updated) throw new AppError('Không tìm thấy nhân viên', 404);
    res.ok(null, 'Cập nhật lương nhân viên thành công');
  } catch (err) {
    next(err);
  }
};

// 👉 THÊM HÀM NÀY ĐỂ TẠO STAFF MỚI
export const createStaff = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Tái sử dụng hàm signup cực xịn của bạn, ép cứng role là 'STAFF'
    const newStaff = await authService.signup({
      username,
      email,
      password,
      role: 'STAFF', 
      full_name: username, // Tạm thời lấy username làm tên hiển thị
      phone_number: null
    });

    res.status(201).json({
      status: 'success',
      message: `Đã cấp tài khoản Staff cho ${username} thành công!`,
      data: newStaff
    });
  } catch (err) {
    next(err);
  }
};