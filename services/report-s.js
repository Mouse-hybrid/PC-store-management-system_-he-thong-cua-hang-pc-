import Report from '../models/report.js';

export const getDailyRevenueReport = async () => {
  const data = await Report.getDailyRevenue();
  return data;
};

export const getSystemAuditLogs = async (limit) => {
  const parsedLimit = limit ? parseInt(limit, 10) : 50;
  const logs = await Report.getSystemLogs(parsedLimit);
  return logs;
};