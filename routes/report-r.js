import express from 'express';
import * as reportController from '../controllers/report-c.js';
import { protect, restrictTo } from '../middlewares/auth-mw.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Reports
 * description: Báo cáo doanh thu và nhật ký hệ thống (Admin/Staff)
 */

router.use(protect); //

/**
 * @swagger
 * /reports/revenue:
 * get:
 * summary: Xem báo cáo doanh thu ngày
 * tags: [Reports]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Trả về dữ liệu doanh thu từ v_daily_revenue
 * 401:
 * $ref: '#/components/schemas/Error'
 * 403:
 * description: Không có quyền (Chỉ STAFF hoặc ADMIN)
 */
router.get('/revenue', restrictTo('STAFF', 'ADMIN'), reportController.getDailyRevenue); //

/**
 * @swagger
 * /reports/audit-logs:
 * get:
 * summary: Xem nhật ký hoạt động hệ thống (Chỉ ADMIN)
 * tags: [Reports]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Danh sách các tác vụ quan trọng đã thực hiện
 * 401:
 * $ref: '#/components/schemas/Error'
 * 403:
 * description: Từ chối truy cập (Yêu cầu quyền ADMIN)
 */
router.get('/audit-logs', restrictTo('ADMIN'), reportController.getSystemLogs); //

// LẤY TỔNG DOANH THU
router.get('/revenue', restrictTo('STAFF', 'ADMIN'), reportController.getDailyRevenue); 
// Tổng đơn hàng đã đặt (Pending -> Completed)
router.get('/order-stats', restrictTo('STAFF', 'ADMIN'), reportController.getOrderStats);
export default router;

// Báo cáo Tài chính Tổng quan (Total, Pending, Refunds)
router.get('/finance-overview', restrictTo('STAFF', 'ADMIN'), reportController.getFinanceOverview);

// Danh sách giao dịch gần nhất
router.get('/recent-transactions', restrictTo('STAFF', 'ADMIN'), reportController.getRecentTransactions);