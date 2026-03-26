import express from 'express';
import * as reviewController from '../controllers/review-c.js';
import { protect } from '../middlewares/auth-mw.js';

const router = express.Router();

/**
 * @swagger
 * /reviews:
 * post:
 * summary: Đăng bài đánh giá sản phẩm (Yêu cầu đăng nhập)
 * tags: [Reviews]
 * security:
 * - bearerAuth: []
 * responses:
 * 201:
 * description: Tạo đánh giá thành công
 */
router.post('/', protect, reviewController.addReview);

/**
 * @swagger
 * /reviews/{productId}:
 * get:
 * summary: Lấy danh sách đánh giá của 1 sản phẩm cụ thể
 * tags: [Reviews]
 * parameters:
 * - in: path
 * name: productId
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Danh sách bài đánh giá
 */
router.get('/:productId', reviewController.getProductReviews);

export default router;