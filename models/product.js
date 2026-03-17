import db from '../db/db.js';

class Product {
  static async findAll() {
    return db('products as p')
      .select(
        'p.*',
        db.raw('f_get_real_stock(p.pro_id) as real_stock'), // Gọi Function SQL
        'b.brand_name',
        'c.category_name'
      )
      .leftJoin('brands as b', 'p.brand_id', 'b.brand_id')
      .leftJoin('categories as c', 'p.category_id', 'c.category_id');
  }

  static async search(keyword) {
    const [rows] = await db.raw('CALL sp_search_product_status(?)', [keyword]); //
    return rows[0];
  }
  // Bổ sung vào models/product.js
static async findWithFilters({ categoryId, brandId, minPrice, maxPrice }) {
    let query = db('products as p')
      .select(
        'p.*',
        db.raw('f_get_real_stock(p.pro_id) as real_stock'), // Đồng bộ với Function SQL
        'b.brand_name',
        'c.category_name'
      )
      .leftJoin('brands as b', 'p.brand_id', 'b.brand_id')
      .leftJoin('categories as c', 'p.category_id', 'c.category_id');
  
    // Lọc theo danh mục nếu có
    if (categoryId) query = query.where('p.category_id', categoryId);
    // Lọc theo thương hiệu nếu có
    if (brandId) query = query.where('p.brand_id', brandId);
    // Lọc theo khoảng giá
    if (minPrice) query = query.where('p.pro_price', '>=', minPrice);
    if (maxPrice) query = query.where('p.pro_price', '<=', maxPrice);
  
    return query;
  }
}
export default Product;