import express from 'express';
import * as orderController from '../controllers/order-c.js';
import { protect, restrictTo } from '../middlewares/auth-mw.js';
import { validate } from '../middlewares/validate-mw.js';
import { createOrderSchema } from '../validators/order-schema.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Orders
 * description: Quản lý đơn hàng và hóa đơn
 */

/**
 * @swagger
 * /orders:
 * post:
 * summary: Tạo đơn hàng mới
 * tags: [Orders]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/OrderInput'
 * responses:
 * 201:
 * description: Thành công
 * 400:
 * $ref: '#/components/schemas/Error'
 */
router.get('/', protect, restrictTo('STAFF', 'ADMIN'), orderController.getAllOrders);

router.post('/', protect, validate(createOrderSchema), orderController.createOrder);

/**
 * @swagger
 * /orders/{orderId}:
 * get:
 * summary: Lấy chi tiết đơn hàng
 * tags: [Orders]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: orderId
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Thông tin chi tiết đơn hàng
 * 401:
 * description: Chưa xác thực
 */
// ĐẶT DÒNG NÀY LÊN TRÊN CÙNG (Dưới đoạn router.post('/'))
/**
 * @swagger
 * /orders/my-orders:
 * get:
 * summary: Xem lịch sử mua hàng của tôi (Khách hàng)
 * tags: [Orders]
 * security:
 * - bearerAuth: []
 */
router.get('/my-orders', protect, orderController.getMyOrders);

router.get('/:orderId', protect, orderController.getOrderDetail);
// Thêm dòng này vào file route của bạn
router.patch(
  '/:orderId/verify', 
  protect, 
  restrictTo('STAFF'), 
  orderController.verifyOrder
);
// Thêm API Hủy đơn hàng (Member và Staff đều dùng được)
router.patch(
  '/:orderId/cancel', 
  protect, 
  orderController.cancelOrder
);
// API Admin duyệt đơn / Hủy đơn
router.patch('/:orderId/status',
    protect,
     restrictTo('ADMIN', 'STAFF'),
      orderController.updateOrderStatus);
      
export default router;