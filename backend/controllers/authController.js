const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);
const multer = require('multer');
const path = require('path');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_mac_dinh';

// =========================
// Multer config
// =========================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename: function (req, file, cb) {
    cb(null, req.user.userId + '-' + Date.now() + path.extname(file.originalname));
  }
});

exports.upload = multer({ storage });

// =========================
// Register
// =========================
exports.register = async (req, res) => {
  const { username, email, password, full_name } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc!' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email không đúng định dạng!' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải từ 6 ký tự trở lên!' });
    }

    const existingUser = await db('users')
      .where({ email })
      .orWhere({ username })
      .first();

    if (existingUser) {
      return res.status(400).json({ message: 'Email hoặc Tên đăng nhập đã tồn tại!' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const [newUser] = await db('users')
      .insert({
        username,
        email,
        password_hash,
        full_name,
        role: 'customer',
      })
      .returning(['id', 'username', 'email', 'full_name', 'role', 'avatar_url']);

    res.status(201).json({
      message: 'Đăng ký thành công!',
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
};

// =========================
// Login
// =========================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();

    if (!user) {
      return res.status(401).json({ message: 'Email không tồn tại!' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu không chính xác!' });
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '1d' });

    

    res.json({
      message: 'Đăng nhập thành công!',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url || null,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
};

// =========================
// Get current user
// =========================
exports.getMe = async (req, res) => {
  try {
    const user = await db('users').where({ id: req.user.userId }).first();

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    res.json({
      message: 'Xác thực Token thành công!',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar_url: user.avatar_url || null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy profile' });
  }
};

// =========================
// Get all users
// =========================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db('users').select(
      'id',
      'username',
      'email',
      'full_name',
      'avatar_url',
      'role',
      'created_at'
    );

    res.status(200).json({ data: users });
  } catch (error) {
    console.error('Lỗi lấy danh sách user:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng' });
  }
};

// =========================
// Upload avatar
// =========================
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn một ảnh!' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    await db('users')
      .where({ id: req.user.userId })
      .update({ avatar_url: avatarUrl });

    res.json({
      message: 'Cập nhật ảnh đại diện thành công!',
      data: {
        avatar_url: avatarUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tải ảnh lên' });
  }
};

// =========================
// Delete user
// =========================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({
        message: 'Lỗi: Bạn không thể tự xóa tài khoản của chính mình!',
      });
    }

    const deletedCount = await db('users').where({ id }).del();

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng này!' });
    }

    res.status(200).json({ message: 'Đã xóa người dùng thành công!' });
  } catch (error) {
    console.error('Lỗi xóa user:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa người dùng' });
  }
};

// =========================
// Update profile
// =========================
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, full_name } = req.body;
    const userId = req.user.userId;

    if (!username || !email || !full_name) {
      return res.status(400).json({
        message: 'Vui lòng nhập đầy đủ username, email và họ tên!',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email không đúng định dạng!' });
    }

    const existed = await db('users')
      .whereNot({ id: userId })
      .andWhere(function () {
        this.where({ username }).orWhere({ email });
      })
      .first();

    if (existed) {
      return res.status(400).json({ message: 'Username hoặc email đã được sử dụng!' });
    }

    await db('users')
      .where({ id: userId })
      .update({
        username,
        email,
        full_name,
      });

    res.status(200).json({
      message: 'Cập nhật thông tin thành công!',
      data: {
        username,
        email,
        full_name,
      },
    });
  } catch (error) {
    console.error('Lỗi cập nhật profile:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin' });
  }
};

// =========================
// Admin stats
// =========================
exports.getAdminStats = async (req, res) => {
  try {
    const usersCount = await db('users').count('id as total').first();
    const gamesCount = await db('games').count('id as total').first();

    res.status(200).json({
      totalUsers: parseInt(usersCount.total || 0),
      totalGames: parseInt(gamesCount.total || 0),
    });
  } catch (error) {
    console.error('Lỗi lấy thống kê:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thống kê' });
  }
};

// =========================
// Change password
// =========================
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mới!' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
    }

    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không chính xác!' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await db('users').where({ id: userId }).update({ password_hash: hashedPassword });

    res.status(200).json({ message: 'Đổi mật khẩu thành công!' });
  } catch (error) {
    console.error('Lỗi đổi mật khẩu:', error);
    res.status(500).json({ message: 'Lỗi server khi đổi mật khẩu' });
  }
};

// =========================
// Search users
// =========================
exports.searchUsers = async (req, res) => {
  try {
    const keyword = (req.query.keyword || '').trim();
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const offset = (page - 1) * limit;

    let query = db('users')
      .whereNot('id', req.user.userId)
      .select('id', 'username', 'email', 'full_name', 'avatar_url', 'role');

    if (keyword) {
      query = query.andWhere(function () {
        this.whereILike('username', `%${keyword}%`)
          .orWhereILike('full_name', `%${keyword}%`)
          .orWhereILike('email', `%${keyword}%`);
      });
    }

    const data = await query.limit(limit).offset(offset);
    res.json({ data, page, limit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi tìm kiếm người dùng' });
  }
};