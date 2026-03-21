import db from '../db/db.js';

class Review {
  // Logic kiểm tra quyền đánh giá
  static async canUserReview(userId, productId) {
    const purchase = await db('orders as o')
      .join('order_details as od', 'o.order_id', 'od.order_id')
      .where({
        'o.user_id': userId,
        'od.product_id': productId,
        'o.status': 'COMPLETED'
      })
      .first();
    return !!purchase;
  }

  // Logic tạo đánh giá mới
  static async create(data) {
    return db('reviews').insert(data);
  }

  // Bổ sung vào bên trong class Review
  static async getByProductId(productId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const sql = db('reviews as r')
      .select('r.id', 'r.rating', 'r.comment', 'r.created_at', 'u.username')
      .join('users as u', 'r.user_id', 'u.user_id')
      .where('r.product_id', productId)
      .orderBy('r.created_at', 'desc'); // Xếp đánh giá mới nhất lên đầu

    const reviews = await sql.clone().limit(limit).offset(offset);
    const totalCount = await sql.clone().clearSelect().count('r.id as total').first();

    return {
      data: reviews,
      pagination: {
        totalItems: Number(totalCount.total),
        currentPage: Number(page),
        totalPages: Math.ceil(Number(totalCount.total) / limit),
        itemsPerPage: Number(limit)
      }
    };
  }
}
export default Review;