import express from 'express';
import * as userController from '../controllers/user-c.js';
import { protect } from '../middlewares/auth-mw.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Users
 * description: Quản lý thông tin cá nhân và điểm thưởng thành viên
 */

/**
 * @swagger
 * /users/me:
 * get:
 * summary: Xem hồ sơ cá nhân của tôi
 * tags: [Users]
 * security:
 * - bearerAuth: []
 * description: Lấy thông tin chi tiết người dùng hiện tại bao gồm cả điểm thưởng (points).
 * responses:
 * 200:
 * description: Trả về thông tin hồ sơ chi tiết
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserProfile'
 * 401:
 * description: Chưa đăng nhập hoặc Token hết hạn
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error'
 */
router.get('/me', protect, userController.getMyProfile);

export default router;