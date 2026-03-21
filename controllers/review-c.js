import ReviewService from '../services/review-s.js';
import Review from '../models/review.js';

export const addReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.user_id || req.user.id; // Lấy từ protect middleware

    await ReviewService.addReview({ userId, productId, rating, comment });

    res.created(null, 'Cảm ơn bạn đã đóng góp đánh giá!');
  } catch (err) {
    next(err);
  }
};

// Bổ sung vào cuối file
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page, limit } = req.query;

    // Gọi hàm Model vừa tạo ở trên
    // (Nếu bạn đang dùng ReviewService thì gọi qua Service nhé)
    const result = await Review.getByProductId(productId, page, limit);

    // Trả về dữ liệu cho Frontend / Postman
    res.status(200).json({
      status: 'success',
      message: 'Lấy danh sách đánh giá thành công',
      data: result.data,
      meta: {
        pagination: result.pagination
      }
    });
  } catch (err) {
    next(err);
  }
};