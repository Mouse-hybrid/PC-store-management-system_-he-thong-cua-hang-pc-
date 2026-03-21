import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Import linh kiện hệ thống
import AppError from './utils/appError.js';
import { requestContext } from './middlewares/request-context.js';
import { accessLogger } from './middlewares/access-logger.js'; // Bổ sung Logger
import { responseEnhancer } from './middlewares/response-mw.js';
import { globalErrorHandler } from './middlewares/error-mw.js';

// 2. Import trọn bộ 10 Routes nghiệp vụ (Đã xây dựng ở bước trước)
import authRouter from './routes/auth-r.js';
import userRouter from './routes/user-r.js';
import productRouter from './routes/product-r.js';
import orderRouter from './routes/order-r.js';
import couponRouter from './routes/coupon-r.js';
import inventoryRouter from './routes/inventory-r.js';
import reportRouter from './routes/report-r.js';
import staffRouter from './routes/staff-r.js';
import paymentRouter from './routes/payment-r.js';
import webhookRouter from './routes/webhook-r.js';
import reviewRouter from './routes/review-r.js'; // Thêm dòng này vào phần import

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- BỘ LỌC TOÀN CỤC (GLOBAL MIDDLEWARES) ---

app.use(helmet()); // Bảo vệ Header
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://localhost:3000',
  credentials: true 
}));

app.use(express.json({ limit: '10kb' })); 
app.use(cookieParser());

// Gắn Request ID & Log truy cập (Phải đặt TRƯỚC Routes để truy vết)
app.use(requestContext); 
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(accessLogger);

// Kích hoạt bộ hỗ trợ phản hồi chuẩn (res.ok, res.created...)
app.use(responseEnhancer);

// Cấu hình thư mục ảnh tĩnh (Để hiển thị ảnh linh kiện PC)
app.use('/public', express.static(path.join(__dirname, 'public')));


// --- ĐĂNG KÝ HỆ THỐNG ROUTES (API V1) ---

const API_V1 = '/api/v1';

app.use(`${API_V1}/auth`, authRouter);
app.use(`${API_V1}/users`, userRouter);
app.use(`${API_V1}/products`, productRouter);
app.use(`${API_V1}/orders`, orderRouter);
app.use(`${API_V1}/coupons`, couponRouter);
app.use(`${API_V1}/inventory`, inventoryRouter);
app.use(`${API_V1}/reports`, reportRouter);
app.use(`${API_V1}/staffs`, staffRouter);
app.use(`${API_V1}/payments`, paymentRouter);
app.use(`${API_V1}/webhooks`, webhookRouter);
app.use(`${API_V1}/reviews`, reviewRouter);

// Tuyến đường kiểm tra nhanh
app.get('/health', (req, res) => {
  res.ok({ uptime: process.uptime() }, 'PC Store API is ready to rock!');
});

// --- XỬ LÝ LỖI ---

// Bắt các route "ma" không tồn tại
app.use((req, res, next) => {
  next(new AppError(`Đường dẫn ${req.originalUrl} không tồn tại trên server!`, 404));
});

// Bộ lọc lỗi cuối cùng (Xử lý cả lỗi Zod và MySQL)
app.use(globalErrorHandler);

export default app;