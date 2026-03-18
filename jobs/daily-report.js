import cron from 'node-cron';
import db from '../db/db.js';
import logger from '../logging/logger.js';

/**
 * Tác vụ: Tổng kết doanh thu ngày từ View v_daily_revenue
 * Tần suất: Tùy chỉnh qua .env (Mặc định 23:55)
 */
const dailyReportJob = () => {
  const schedule = process.env.DAILY_REPORT_CRON || '55 23 * * *';

  cron.schedule(schedule, async () => {
    logger.info('📊 [Cron Job] Đang tổng hợp báo cáo doanh thu ngày...');

    try {
      // Sử dụng UTC_DATE() để khớp với cấu hình timezone 'Z' của Knex
      const report = await db('v_daily_revenue')
        .whereRaw('order_date = UTC_DATE()')
        .first();

      if (report) {
        logger.info(`📈 [Daily Report] Kết quả ngày ${report.order_date}:`);
        logger.info(`   - Tổng đơn hàng: ${report.total_orders}`);
        logger.info(`   - Doanh thu: ${Number(report.revenue_sum).toLocaleString('vi-VN')} VNĐ`);
      } else {
        logger.info('ℹ️ [Daily Report] Không có phát sinh giao dịch trong ngày hôm nay.');
      }
    } catch (error) {
      logger.error('❌ [Cron Job Error] Lỗi khi trích xuất báo cáo doanh thu:');
      logger.error(error.message);
    }
  });
};

export default dailyReportJob;