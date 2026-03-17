import Product from '../models/product.js';
import ProductItem from '../models/product-item.js'; // CẦN BỔ SUNG
import AppError from '../utils/appError.js';

export const listAllProducts = async () => {
  return await Product.findAll(); 
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

  