import * as authService from '../services/auth-s.js';

export const signup = async (req, res, next) => {
  try {
    const newUser = await authService.signup(req.body); // Gọi nghiệp vụ đăng ký và tạo Profile
    res.created(newUser, 'Đăng ký tài khoản thành công!');
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);

    // Lưu Access Token vào Cookie bảo mật
    res.cookie('jwt', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 ngày
    });

    res.ok(result, 'Đăng nhập thành công!');
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.user_id); // Xóa Refresh Token trong DB
    res.clearCookie('jwt');
    res.ok(null, 'Đăng xuất thành công!');
  } catch (err) {
    next(err);
  }
};