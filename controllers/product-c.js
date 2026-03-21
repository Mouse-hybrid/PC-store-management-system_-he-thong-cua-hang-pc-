import * as productService from '../services/product-s.js';
import Product from '../models/product.js';
import db from '../db/db.js';
import AppError from '../utils/appError.js';

export const getProducts = async (req, res, next) => {
  try {
    // Truyền toàn bộ req.query (page, limit, brand, priceMin...) vào Model
    const result = await Product.getAll(req.query);
    
    // Trả về dữ liệu kèm thông tin phân trang
    res.ok(result.data, 'Lấy danh sách sản phẩm thành công', result.pagination);
  } catch (err) {
    next(err);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query; 
    // SỬA: Gọi getFilteredProducts và truyền object chứa q
    const results = await productService.getFilteredProducts({ q }); 
    res.list(results, { keyword: q });
  } catch (err) {
    next(err);
  }
};

export const importProduct = async (req, res, next) => {
  try {
    // Lấy data từ Postman gửi lên
    const { sku, name, price, qty, brandId, catId, description } = req.body;

    const result = await Product.importProduct({
      sku, name, price, qty, brandId, catId, description
    });

    res.status(201).json({
      status: 'success',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ status: 'fail', message: 'Sản phẩm không tồn tại!' });
    }

    res.ok(product, 'Lấy chi tiết sản phẩm thành công');
  } catch (err) {
    next(err);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await db('categories').select('*');
    res.list(categories, { count: categories.length, message: 'Danh sách Danh mục' });
  } catch (err) { next(err); }
};

export const getAllBrands = async (req, res, next) => {
  try {
    const brands = await db('brands').select('*');
    res.list(brands, { count: brands.length, message: 'Danh sách Thương hiệu' });
  } catch (err) { next(err); }
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Vui lòng chọn một file ảnh để upload!', 400);
    }

    // Tạo đường dẫn URL để Frontend có thể hiển thị ảnh
    const imageUrl = `/public/uploads/products/${req.file.filename}`;

    // Ở đây, bạn có thể gọi DB để UPDATE cột image_url trong bảng products 
    // Còn hiện tại, mình trả về URL luôn để Frontend nhận diện:
    res.ok({ imageUrl }, 'Upload ảnh sản phẩm thành công!');
  } catch (err) {
    next(err);
  }
};