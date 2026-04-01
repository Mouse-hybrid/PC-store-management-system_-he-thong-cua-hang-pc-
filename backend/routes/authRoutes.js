const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// User thường
router.get('/me', verifyToken, authController.getMe);
router.get('/search', verifyToken, authController.searchUsers);
router.put('/update-profile', verifyToken, authController.updateProfile);
router.put('/change-password', verifyToken, authController.changePassword);
router.post(
  '/upload-avatar',
  verifyToken,
  authController.upload.single('avatar'),
  authController.uploadAvatar
);

// Chỉ admin
router.get('/users', verifyToken, isAdmin, authController.getAllUsers);
router.get('/stats', verifyToken, isAdmin, authController.getAdminStats);
router.delete('/users/:id', verifyToken, isAdmin, authController.deleteUser);

module.exports = router;