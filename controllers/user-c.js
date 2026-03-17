import User from '../models/user.js';

export const getMyProfile = async (req, res, next) => {
  try {
    // req.user được gán từ protect middleware
    const profile = await User.getProfile(req.user.user_id, req.user.role);
    res.ok(profile, 'Tải thông tin cá nhân thành công');
  } catch (err) {
    next(err);
  }
};