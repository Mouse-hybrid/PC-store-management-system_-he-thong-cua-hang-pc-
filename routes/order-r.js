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
router.post('/', validate(createOrderSchema), orderController.createOrder);

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
router.get('/:orderId', protect, orderController.getOrderDetail);
// Thêm dòng này vào file route của bạn
router.patch(
  '/:orderId/verify', 
  protect, 
  restrictTo('STAFF'), 
  orderController.verifyOrder
);
export default router;