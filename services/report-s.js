import db from '../db/db.js';

export const getDailyRevenueReport = async () => {
  // Truy vấn trực tiếp từ View v_daily_revenue
  return await db('v_daily_revenue').select('*');
};

export const getSystemAuditLogs = async (limit) => {
  return await db('system_logs').orderBy('created_at', 'desc').limit(limit || 20); //
};