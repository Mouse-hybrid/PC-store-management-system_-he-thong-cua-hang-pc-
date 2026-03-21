import express from 'express';
import * as reviewController from '../controllers/review-c.js';
import { protect } from '../middlewares/auth-mw.js';

const router = express.Router();

// Khách hàng phải đăng nhập mới được đánh giá
router.post('/', protect, reviewController.addReview);
// API Lấy danh sách đánh giá (Không cần token protect vì ai cũng xem được)
router.get('/:productId', reviewController.getProductReviews);

export default router;