import express from 'express';
import * as authController from '../controllers/auth-c.js';
import { validate } from '../middlewares/validate-mw.js';
import { protect } from '../middlewares/auth-mw.js';
import { registerSchema, loginSchema } from '../validators/auth-schema.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Auth
 * description: Xác thực người dùng và quản lý phiên (Member/Staff)
 */

/**
 * @swagger
 * /auth/register:
 * post:
 * summary: Đăng ký tài khoản mới
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/RegisterInput'
 * responses:
 * 201:
 * description: Đăng ký thành công
 */
router.post('/register', validate(registerSchema), authController.signup);

/**
 * @swagger
 * /auth/login:
 * post:
 * summary: Đăng nhập hệ thống
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/LoginInput'
 * responses:
 * 200:
 * description: Đăng nhập thành công, trả về Access Token
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @swagger
 * /auth/logout:
 * post:
 * summary: Đăng xuất khỏi hệ thống
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * responses:
 * 204:
 * description: Đã đăng xuất
 */
router.post('/logout', protect, authController.logout);

export default router;