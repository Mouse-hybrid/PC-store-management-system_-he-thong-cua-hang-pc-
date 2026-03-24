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

// 👉 1. API Lấy Tổng quan Tài chính (Doanh thu, Chờ duyệt, Hoàn tiền)
export const getFinanceOverview = async (req, res, next) => {
  try {
    // 1. Tổng doanh thu (Đơn hàng đã COMPLETED)
    const revenueResult = await db('orders')
      .where('status', 'COMPLETED')
      .sum('final_amount as total');
    const totalRevenue = revenueResult[0].total || 0;

    // 2. Tiền đang chờ duyệt (Đơn hàng PENDING)
    const pendingResult = await db('orders')
      .where('status', 'PENDING')
      .sum('final_amount as total');
    const totalPending = pendingResult[0].total || 0;

    // 3. Tiền hoàn trả (Đơn hàng REFUNDED hoặc CANCELLED)
    const refundResult = await db('orders')
      .whereIn('status', ['REFUNDED', 'CANCELLED'])
      .sum('final_amount as total');
    const totalRefunds = refundResult[0].total || 0;

    res.status(200).json({
      status: 'success',
      data: {
        totalRevenue: Number(totalRevenue),
        totalPending: Number(totalPending),
        totalRefunds: Number(totalRefunds)
      }
    });
  } catch (err) {
    next(err);
  }
};

// 👉 2. API Lấy Danh sách Giao dịch / Đơn hàng gần nhất
export const getRecentTransactions = async (req, res, next) => {
  try {
    // Lấy 10 giao dịch mới nhất để hiển thị lên Dashboard
    const transactions = await db('orders')
      .select('order_id', 'final_amount', 'status', 'created_at', 'guest_name')
      .orderBy('created_at', 'desc')
      .limit(10);

    res.status(200).json({
      status: 'success',
      data: transactions
    });
  } catch (err) {
    next(err);
  }
};