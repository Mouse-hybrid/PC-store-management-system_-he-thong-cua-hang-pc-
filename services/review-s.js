import Review from '../models/review.js';
import AppError from '../utils/appError.js';

class ReviewService {
  static async addReview({ userId, productId, rating, comment }) {
    // 1. Kiểm tra: Chỉ khách đã nhận hàng (COMPLETED) mới được đánh giá
    const canReview = await Review.canUserReview(userId, productId);
    if (!canReview) {
      throw new AppError('Bạn chỉ có thể đánh giá linh kiện PC đã được giao thành công!', 403);
    }

    // 2. Chặn lỗi rating
    if (rating < 1 || rating > 5) throw new AppError('Số sao phải từ 1-5!', 400);

    // 3. Lưu qua Model
    return await Review.create({
      product_id: productId,
      user_id: userId,
      rating,
      comment: comment?.trim()
    });
  }
}
export default ReviewService;