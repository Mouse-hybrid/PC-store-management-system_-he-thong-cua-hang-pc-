import * as reportService from '../services/report-s.js';
import db from '../db/db.js';

export const getDailyRevenue = async (req, res, next) => {
  try {
    const report = await reportService.getDailyRevenueReport();
    res.ok(report, 'Báo cáo doanh thu theo ngày');
  } catch (err) {
    next(err);
  }
};

export const getSystemLogs = async (req, res, next) => {
  try {
    const logs = await reportService.getSystemAuditLogs(req.query.limit);
    res.ok(logs);
  } catch (err) {
    next(err);
  }
};

export const getOrderStats = async (req, res, next) => {
  try {
    const result = await db('orders').count('order_id as total').first();
    res.ok({ totalOrders: Number(result.total) || 0 }, 'Thống kê tổng đơn hàng');
  } catch (err) {
    next(err);
  }
};