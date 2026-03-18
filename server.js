import https from 'https';
import http from 'http';
import fs from 'fs';
import app from './app.js';
import logger from './logging/logger.js';
import dotenv from 'dotenv';
import db, { initializeSqlLogic } from './db/db.js';

dotenv.config();

// 1. Kiểm tra chứng chỉ SSL (Chỉ cho production)
let sslOptions;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  try {
    sslOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH)
    };
  } catch (err) {
    logger.error("❌ Lỗi: Không thể đọc file SSL! Kiểm tra folder certs/ và file .env");
    process.exit(1);
  }
}

const port = isProduction ? 3443 : 3001;
const server = isProduction ? https.createServer(sslOptions, app) : http.createServer(app);

// 2. Quy trình khởi động đồng bộ (Startup Sequence)
const startServer = async () => {
  try {
    // Bước A: Kiểm tra kết nối tới MySQL
    logger.info('⏳ Đang kết nối Database...');
    await db.raw('SELECT 1'); 
    logger.info('✅ Database đã kết nối thành công.');

    // Bước B: Nạp Stored Procedures, Triggers, Functions
    logger.info('⏳ Đang đồng bộ SQL Logic (Procedures/Triggers)...');
    await initializeSqlLogic();
    logger.info('✅ SQL Logic đã sẵn sàng.');

    // Bước C: Mở cổng Server
    server.listen(port, () => {
      const protocol = isProduction ? 'https' : 'http';
      logger.info(`🚀 PC_Store API đang chạy tại: ${protocol}://localhost:${port}`);
      logger.info(`🛠  Chế độ: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    logger.error('❌ Thất bại khi khởi động hệ thống:');
    logger.error(err);
    process.exit(1);
  }
};

startServer();

// --- QUẢN LÝ LỖI HỆ THỐNG (STABILITY) ---

process.on('uncaughtException', (err) => {
  logger.error('💥 UNCAUGHT EXCEPTION! Đang tắt hệ thống...');
  logger.error(`${err.name}: ${err.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error('💥 UNHANDLED REJECTION! Đang tắt hệ thống...');
  logger.error(`${err.name}: ${err.message}`);
  server.close(() => process.exit(1));
});