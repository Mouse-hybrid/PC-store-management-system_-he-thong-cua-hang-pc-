import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// 1. Import linh kiện hệ thống
import AppError from './utils/appError.js';
import { requestContext } from './middlewares/request-context.js';
import { accessLogger } from './middlewares/access-logger.js';
import { responseEnhancer } from './middlewares/response-mw.js';
import { globalErrorHandler } from './middlewares/error-mw.js';

// 2. Import trọn bộ 11 Routes nghiệp vụ
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
import reviewRouter from './routes/review-r.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- BỘ LỌC TOÀN CỤC (GLOBAL MIDDLEWARES) ---

app.use(helmet({
  crossOriginResourcePolicy: false, // cho phép ảnh đc chia sẻ 
}));

app.use(cors({
  origin: true,
  credentials: true 
}));

app.use(express.json({ limit: '10kb' })); 
app.use(cookieParser());

// Gắn Request ID & Log truy cập
app.use(requestContext); 
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(accessLogger);

// Kích hoạt bộ hỗ trợ phản hồi chuẩn
app.use(responseEnhancer);

// Cấu hình thư mục ảnh tĩnh
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'));

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

// --- CẤU HÌNH SWAGGER API DOCS ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PC Store API',
      version: '1.0.0',
      description: 'Tài liệu API tự động cho hệ thống PC Store',
    },
    servers: [
      {
        url: 'https://localhost:3443', // Domain của server khi chạy local
        description: 'Development Server (HTTPS)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    // KHAI BÁO TAGS Ở ĐÂY SẼ KHÔNG BAO GIỜ BỊ LỖI YAML NỮA
    tags: [
      { name: 'Auth', description: 'Xác thực người dùng và quản lý phiên (Member/Staff)' },
      { name: 'Coupons', description: 'Quản lý mã giảm giá (Voucher)' },
      { name: 'Inventory', description: 'Quản lý kho hàng và bảo hành' },
      { name: 'Orders', description: 'Quản lý đơn hàng và quy trình giao nhận' },
      { name: 'Payments', description: 'Phương thức thanh toán và Webhook' },
      { name: 'Products', description: 'Quản lý và tra cứu linh kiện máy tính' },
      { name: 'Reports', description: 'Báo cáo doanh thu và nhật ký hệ thống' },
      { name: 'Reviews', description: 'Đánh giá và bình luận sản phẩm' },
      { name: 'Staffs', description: 'Quản lý nhân sự và các nghiệp vụ nội bộ' },
      { name: 'Users', description: 'Quản lý thông tin cá nhân và điểm thưởng thành viên' },
      { name: 'Webhooks', description: 'Nhận dữ liệu tự động từ đối tác thanh toán' }
    ]
  },
  apis: [/*'./routes/*.js'*/],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- XỬ LÝ LỖI ---

app.use((req, res, next) => {
  next(new AppError(`Đường dẫn ${req.originalUrl} không tồn tại trên server!`, 404));
});

app.use(globalErrorHandler);

export default app;