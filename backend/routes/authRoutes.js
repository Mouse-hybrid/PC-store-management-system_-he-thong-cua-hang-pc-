const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', verifyToken, authController.getMe);
// Route lấy danh sách user (Chỉ cho phép xem, cần có verifyToken)
router.get('/users', verifyToken, authController.getAllUsers);
// Route lấy thống kê Admin
router.get('/stats', verifyToken, authController.getAdminStats);
// Route tải ảnh lên (Yêu cầu token và dùng multer)
router.post('/upload-avatar', verifyToken, authController.upload.single('avatar'), authController.uploadAvatar);
// Route xóa user (Cần Token của Admin)
router.delete('/users/:id', verifyToken, authController.deleteUser);
// Route cập nhật profile
router.put('/update-profile', verifyToken, authController.updateProfile);
// Route đổi mật khẩu
router.put('/change-password', verifyToken, authController.changePassword);
module.exports = router;