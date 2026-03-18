import cron from 'node-cron';
import db from '../db/db.js';
import logger from '../logging/logger.js';

/**
 * Tác vụ: Tự động hủy đơn hàng hết hạn thanh toán
 * Mục tiêu: Hoàn trả số lượng linh kiện vào kho thực tế (f_get_real_stock)
 */
const cancelExpiredOrders = () => {
  // Tần suất chạy được cấu hình linh hoạt (mặc định 15 phút)
  const cronSchedule = process.env.ORDER_CANCEL_CRON || '*/15 * * * *';

  cron.schedule(cronSchedule, async () => {
    logger.info('⏳ [Cron Job] Đang kiểm tra các đơn hàng hết hạn...');
    
    try {
      // Lấy thời gian hết hạn từ .env (mặc định 30 phút) 
      const expiredMinutes = Number(process.env.ORDER_EXPIRY_MINUTES) || 30;
      
      await db.transaction(async (trx) => {
        // Sử dụng UTC_TIMESTAMP để đồng bộ với timezone 'Z' của Knex
        const affectedRows = await trx('orders')
          .where('status', 'PENDING')
          .whereRaw(`created_at < UTC_TIMESTAMP() - INTERVAL ? MINUTE`, [expiredMinutes])
          .update({
            status: 'CANCELLED',
            updated_at: db.fn.now() // Sử dụng hàm thời gian của DB để nhất quán
          });

        if (affectedRows > 0) {
          logger.info(`✅ [Cron Job] Đã hủy ${affectedRows} đơn hàng quá hạn ${expiredMinutes} phút.`);
        }
      });
    } catch (error) {
      logger.error('❌ [Cron Job Error] Lỗi khi thực hiện hủy đơn hàng:');
      logger.error(error.message);
    }
  });
};

export default cancelExpiredOrders;