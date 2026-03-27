const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);
// Cấu hình Multer để lưu ảnh
const multer = require('multer');
const path = require('path');

exports.register = async (req, res) => {
  const { username, email, password, full_name } = req.body;

  try {
    // --- 1. INPUT VALIDATION ---
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc!' });
    }
    // Kiểm tra định dạng email bằng Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email không đúng định dạng!' });
    }
    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải từ 6 ký tự trở lên!' });
    }

    const existingUser = await db('users').where({ email }).orWhere({ username }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'Email hoặc Tên đăng nhập đã tồn tại!' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const [newUser] = await db('users').insert({
      username,
      email,
      password_hash,
      full_name,
      role: 'customer'
    }).returning(['id', 'username', 'email', 'role']);

    res.status(201).json({ message: 'Đăng ký thành công!', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
};

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
      process.env.JWT_SECRET || 'secret_key_mac_dinh', // Đảm bảo có secret key
      { expiresIn: '1d' }
    );

    // --- SỬA LẠI CẤU TRÚC: Bọc trong object "data" để khớp với Frontend ---
    res.json({
      message: 'Đăng nhập thành công!',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
};

// Hàm Lấy thông tin cá nhân (Yêu cầu phải có Token)
exports.getMe = async (req, res) => {
  try {
    // req.user.userId đã được hàm middleware ở Bước 1 giải mã và cung cấp
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
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy profile' });
  }
};

// Hàm lấy danh sách tất cả người dùng (Dành cho Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db('users').select('id', 'username', 'email', 'full_name', 'role', 'created_at');
    res.status(200).json({ data: users });
  } catch (error) {
    console.error("Lỗi lấy danh sách user:", error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng' });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/'); // Lưu vào thư mục này
  },
  filename: function (req, file, cb) {
    // Đổi tên file thành ID của user + đuôi mở rộng (vd: 1-16789.png)
    cb(null, req.user.userId + '-' + Date.now() + path.extname(file.originalname));
  }
});

exports.upload = multer({ storage: storage });

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Vui lòng chọn một ảnh!' });
    
    // Tạo đường dẫn ảnh để lưu vào Database
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    // Cập nhật vào DB
    await db('users').where({ id: req.user.userId }).update({ avatar_url: avatarUrl });
    
    res.json({ message: 'Cập nhật ảnh đại diện thành công!', avatar_url: avatarUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tải ảnh lên' });
  }
};

// Hàm Xóa người dùng (Dành cho Admin)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Bảo mật: Ngăn chặn Admin tự tay "bóp dái" xóa chính mình
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({ message: 'Lỗi: Bạn không thể tự xóa tài khoản của chính mình!' });
    }

    // Tiến hành xóa trong Database
    const deletedCount = await db('users').where({ id }).del();
    
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng này!' });
    }

    res.status(200).json({ message: 'Đã xóa người dùng thành công!' });
  } catch (error) {
    console.error("Lỗi xóa user:", error);
    res.status(500).json({ message: 'Lỗi server khi xóa người dùng' });
  }
};

// Hàm cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
  try {
    const { full_name } = req.body;
    const userId = req.user.userId;

    if (!full_name) {
      return res.status(400).json({ message: 'Vui lòng nhập họ và tên mới!' });
    }

    // Cập nhật vào Database
    await db('users').where({ id: userId }).update({ full_name });

    res.status(200).json({ message: 'Cập nhật thông tin thành công!', full_name });
  } catch (error) {
    console.error("Lỗi cập nhật profile:", error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin' });
  }
};

// Hàm Lấy Thống kê cho Admin
exports.getAdminStats = async (req, res) => {
  try {
    // 1. Đếm tổng số user trong bảng users
    const usersCount = await db('users').count('id as total').first();
    
    // 2. Đếm tổng số game trong bảng games
    const gamesCount = await db('games').count('id as total').first();

    res.status(200).json({
      totalUsers: parseInt(usersCount.total || 0),
      totalGames: parseInt(gamesCount.total || 0)
    });
  } catch (error) {
    console.error("Lỗi lấy thống kê:", error);
    res.status(500).json({ message: 'Lỗi server khi lấy thống kê' });
  }
};

// Hàm Đổi mật khẩu
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

    // 1. Lấy thông tin user hiện tại từ DB
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    // 2. Kiểm tra mật khẩu cũ xem có khớp không
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không chính xác!' });
    }

    // 3. Mã hóa mật khẩu mới
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 4. Lưu vào Database
    await db('users').where({ id: userId }).update({ password_hash: hashedPassword });

    res.status(200).json({ message: 'Đổi mật khẩu thành công!' });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    res.status(500).json({ message: 'Lỗi server khi đổi mật khẩu' });
  }
};