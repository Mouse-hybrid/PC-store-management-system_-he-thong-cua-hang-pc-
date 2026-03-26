import express from 'express';
import * as orderController from '../controllers/order-c.js';
import { protect, restrictTo } from '../middlewares/auth-mw.js';
import { validate } from '../middlewares/validate-mw.js';
import { createOrderSchema } from '../validators/order-schema.js';

const router = express.Router();

/**
 * @swagger
 * /orders:
 * get:
 * summary: Lấy toàn bộ danh sách đơn hàng (Staff/Admin)
 * tags: [Orders]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Thành công
 */
router.get('/', protect, restrictTo('STAFF', 'ADMIN'), orderController.getAllOrders);

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
 */
router.post('/', protect, validate(createOrderSchema), orderController.createOrder);

/**
 * @swagger
 * /orders/my-orders:
 * get:
 * summary: Xem lịch sử mua hàng của tôi (Khách hàng)
 * tags: [Orders]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Danh sách đơn hàng cá nhân
 */
router.get('/my-orders', protect, orderController.getMyOrders);

/**
 * @swagger
 * /orders/{orderId}:
 * get:
 * summary: Lấy chi tiết một đơn hàng
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
 */
router.get('/:orderId', protect, orderController.getOrderDetail);

/**
 * @swagger
 * /orders/{orderId}/verify:
 * patch:
 * summary: Xác nhận đơn (Bán POS tại quầy) -> COMPLETED
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
 * description: Đơn hàng đã được chốt
 */
router.patch('/:orderId/verify', protect, restrictTo('STAFF', 'ADMIN'), orderController.verifyOrder);

/**
 * @swagger
 * /orders/{orderId}/cancel:
 * patch:
 * summary: Hủy đơn hàng (Hoàn trả tồn kho)
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
 * description: Hủy đơn thành công
 */
router.patch('/:orderId/cancel', protect, orderController.cancelOrder);

/**
 * @swagger
 * /orders/{orderId}/ship:
 * patch:
 * summary: Chuyển trạng thái sang Giao Hàng (SHIPPED)
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
 * description: Cập nhật thành công
 */
router.patch('/:orderId/ship', protect, restrictTo('STAFF', 'ADMIN'), orderController.shipOrder);

/**
 * @swagger
 * /orders/{orderId}/complete:
 * patch:
 * summary: Chốt đơn hoàn thành giao hàng (COMPLETED)
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
 * description: Đơn hàng hoàn tất
 */
router.patch('/:orderId/complete', protect, restrictTo('STAFF', 'ADMIN'), orderController.completeOrder);

export default router;