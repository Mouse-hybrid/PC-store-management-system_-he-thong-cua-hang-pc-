import Staff from '../models/staff.js';
import AppError from '../utils/appError.js';

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