import express from 'express';
import * as staffController from '../controllers/staff-c.js';
import { protect, restrictTo } from '../middlewares/auth-mw.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Staffs
 * description: Quản lý nhân sự và các nghiệp vụ nội bộ (Chỉ dành cho Admin)
 */

// Áp dụng bảo vệ cho toàn bộ các tuyến đường trong file này
router.use(protect);

/**
 * @swagger
 * /staffs/salary:
 * patch:
 * summary: Cập nhật lương cho nhân viên
 * tags: [Staffs]
 * security:
 * - bearerAuth: []
 * description: Điều chỉnh mức lương cơ bản hoặc phụ phí cho nhân viên. Chỉ Admin mới có quyền thực hiện.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - staffId
 * - newSalary
 * properties:
 * staffId:
 * type: integer
 * description: ID của nhân viên cần cập nhật
 * newSalary:
 * type: number
 * description: Mức lương mới
 * responses:
 * 200:
 * description: Cập nhật thành công
 * 401:
 * $ref: '#/components/schemas/Error'
 * 403:
 * description: Không có quyền truy cập (Chỉ dành cho ADMIN)
 * 404:
 * description: Không tìm thấy nhân viên
 */
router.patch('/salary', restrictTo('ADMIN'), staffController.updateStaffSalary);

export default router;