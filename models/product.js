import db from '../db/db.js';

class Product {
  static async getAll(queryParams) {
    const { page = 1, limit = 10, brand, priceMin, priceMax, search } = queryParams;
    const offset = (page - 1) * limit;

    let sql = db('products as p')
      .select(
        'p.*', 
        db.raw('FLOOR(p.pro_quantity / 2) as real_stock'), // Chia đôi kho, làm tròn xuống
        'b.brand_name', 
        'c.cat_name'
      )
      .leftJoin('brands as b', 'p.brand_id', 'b.brand_id')
      .leftJoin('categories as c', 'p.category_id', 'c.category_id')

    if (brand) sql = sql.where('b.brand_name', brand);
    if (priceMin) sql = sql.where('p.pro_price', '>=', priceMin);
    if (priceMax) sql = sql.where('p.pro_price', '<=', priceMax);
    if (search) sql = sql.where('p.pro_name', 'like', `%${search}%`);

    const products = await sql.clone().limit(limit).offset(offset);
    const totalCount = await sql.clone().clearSelect().count('p.pro_id as totall').first();

    return {
      data: products,
      pagination: {
        totalItems: Number(totalCount.total),
        currentPage: Number(page),
        totalPages: Math.ceil(Number(totalCount.total) / limit),
        itemsPerPage: Number(limit)
      }
    };
  }

  static async findAll() {
    return db('products as p')
      .select(
        'p.*',
        db.raw('f_get_real_stock(p.pro_id) as real_stock'), // Gọi Function SQL
        'b.brand_name',
        'c.cat_name'
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
        'c.cat_name'
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
  static async importProduct({ sku, name, price, qty, brandId, catId, description }) {
    // Gọi thủ tục sp_import_product_safe với 7 tham số
    const rawResponse = await db.raw(
      'CALL sp_import_product_safe(?, ?, ?, ?, ?, ?, ?)',
      [sku, name, price, qty, brandId, catId, description || null]
    );
    
    // Lấy kết quả trả về từ Procedure
    const rows = rawResponse[0];
    const resultSet = rows.find(item => Array.isArray(item));
    
    if (resultSet && resultSet.length > 0) {
      return resultSet[0]; // Trả về { status: 'SUCCESS', message: 'Đã nhập thêm...' }
    }
    return { status: 'ERROR', message: 'Lỗi khi nhập hàng vào DB' };
  }

  // Lấy chi tiết 1 sản phẩm kèm tồn kho
  static async findById(productId) {
    return db('products as p')
      .select(
        'p.*',
        db.raw('f_get_real_stock(p.pro_id) as real_stock'), // Gọi Function SQL
        'b.brand_name',
        'c.cat_name'
      )
      .leftJoin('brands as b', 'p.brand_id', 'b.brand_id')
      .leftJoin('categories as c', 'p.category_id', 'c.category_id')
      .where('p.pro_id', productId)
      .first(); // .first() để trả về 1 object thay vì 1 mảng
  }
}
export default Product;