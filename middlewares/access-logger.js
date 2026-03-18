import logger from '../logging/logger.js';

export const accessLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      type: 'ACCESS_LOG',
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      requestId: req.requestId, // Đồng bộ requestId để truy vết
      ip: req.ip
    });
  });
  next();
};