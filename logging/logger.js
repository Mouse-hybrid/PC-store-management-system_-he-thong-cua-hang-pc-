import winston from 'winston';

// Định nghĩa định dạng Log
const logFormat = winston.format.printf(({ level, message, timestamp, requestId }) => {
  return `${timestamp} [${level.toUpperCase()}] ${requestId ? `[ID:${requestId}]` : ''}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json() // Lưu tệp dưới dạng JSON để sau này dễ dùng công cụ phân tích
  ),
  transports: [
    // 1. In ra console để xem lúc đang code (có màu sắc)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // 2. Ghi lỗi nghiêm trọng vào file riêng
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // 3. Ghi tất cả mọi thứ vào file chung
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

export default logger;