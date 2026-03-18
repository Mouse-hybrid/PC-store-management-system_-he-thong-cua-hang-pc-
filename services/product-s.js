import Product from '../models/product.js';
import ProductItem from '../models/product-item.js'; // CẦN BỔ SUNG
import AppError from '../utils/appError.js';
<<<<<<< HEAD
import db from '../db/db.js'

export const listAllProducts = async () => {
  return await db('products as p')
    .select(
      'p.*', 
      db.raw('f_get_real_stock(p.pro_id) as real_stock'), 
      'b.brand_name', 
      'c.cat_name' // <--- CHỈ CẦN SỬA CHỖ NÀY LÀ XONG
    )
    .leftJoin('brands as b', 'p.brand_id', 'b.brand_id')
    .leftJoin('categories as c', 'p.category_id', 'c.category_id');
=======

export const listAllProducts = async () => {
  return await Product.findAll(); 
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
};

export const getInventoryBySerial = async (serial) => {
  // Đồng bộ với bảng product_items để tra cứu bảo hành
  const item = await ProductItem.getWarrantyInfo(serial);
  if (!item) throw new AppError('Số Serial không tồn tại trong hệ thống', 404);
  return item;
};

// Bổ sung vào services/product-s.js
export const getFilteredProducts = async (filters) => {
    // Nếu có từ khóa 'q', ưu tiên dùng Stored Procedure tìm kiếm
    if (filters.q) {
      return await Product.search(filters.q); 
    }
    // Nếu không, thực hiện lọc theo các thuộc tính linh kiện
    return await Product.findWithFilters(filters);
  };

  