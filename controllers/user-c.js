import User from '../models/user.js';
import AppError from '../utils/appError.js';

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