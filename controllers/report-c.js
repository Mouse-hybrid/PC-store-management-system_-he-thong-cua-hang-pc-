import * as reportService from '../services/report-s.js';

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