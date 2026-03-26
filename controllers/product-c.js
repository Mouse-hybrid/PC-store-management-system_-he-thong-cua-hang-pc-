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

    const { id } = req.params; // Lấy ID sản phẩm từ URL
    
    // Tạo đường dẫn URL (Bỏ chữ /public đi nếu backend của bạn expose thư mục uploads)
    const imageUrl = `public/uploads/products/${req.file.filename}`;

    // ĐÃ SỬA: LƯU ĐƯỜNG DẪN ẢNH VÀO CỘT image_url CỦA SẢN PHẨM TRONG DATABASE
    await db('products').where('pro_id', id).update({ image_url: imageUrl });

    res.ok({ imageUrl }, 'Upload ảnh sản phẩm thành công!');
  } catch (err) {
    next(err);
  }
};

// 1. Hàm cập nhật thông tin sản phẩm (Chuẩn Knex.js)

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pro_name, pro_sku, pro_price, category_id, brand_id, pro_warranty, description } = req.body;

    // Dùng cú pháp của Knex để UPDATE
    const updatedRows = await db('products')
      .where('pro_id', id)
      .update({
        pro_name: pro_name,
        pro_sku: pro_sku,
        pro_price: pro_price,
        category_id: category_id, // Cập nhật danh mục
        brand_id: brand_id,       // Cập nhật thương hiệu
        pro_warranty: pro_warranty, // Cập nhật bảo hành
        description: description    // Cập nhật mô tả
      });

    if (updatedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy sản phẩm' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Cập nhật sản phẩm thành công'
    });
  } catch (error) {
    next(error);
  }
};

// 2. Hàm nhập kho (Restock) - Đã sửa lỗi 7 tham số
export const restockProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    // Lấy ID Admin/Staff đang đăng nhập (mặc định 1 nếu test chưa có token)
    const staffId = req.user?.id || req.user?.staff_id || 1; 

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ status: 'error', message: 'Số lượng không hợp lệ' });
    }

    // 👉 BƯỚC MỚI: Lấy thông tin hiện tại của SP để lấy đủ 7 tham số
    const product = await db('products').where('pro_id', id).first();
    
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy sản phẩm này' });
    }

    // 👉 TRUYỀN ĐỦ 7 THAM SỐ VÀO PROCEDURE (Thứ tự dựa trên bảng của bạn)
    await db.raw('CALL sp_import_product_safe(?, ?, ?, ?, ?, ?, ?)', [
      staffId,             // ? 1 
      id,                  // ? 2 
      product.pro_price,   // ? 3 
      quantity,            // ? 4 
      product.brand_id,    // ? 5  
      product.category_id, // ? 6 
      product.pro_name     // ? 7 
    ]);

    res.status(200).json({
      status: 'success',
      message: `Admin/Staff ${staffId} đã nhập thêm ${quantity} cái cho sản phẩm ${product.pro_name}`
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await db('products').where('pro_id', id).del(); // Xóa trong MySQL bằng Knex
    if (!deleted) return res.status(404).json({ status: 'fail', message: 'Không thấy SP' });
    res.status(200).json({ status: 'success', message: 'Đã xóa sản phẩm khỏi kho' });
  } catch (error) { next(error); }
};

// --- BỔ SUNG VÀO CUỐI FILE product-c.js ---

export const createCategory = async (req, res, next) => {
  try {
    const { cat_name, description } = req.body;
    if (!cat_name) return res.status(400).json({ status: 'error', message: 'Tên danh mục không được để trống' });
    
    await db('categories').insert({ cat_name, description });
    res.status(201).json({ status: 'success', message: 'Thêm danh mục thành công' });
  } catch (err) { next(err); }
};

export const createBrand = async (req, res, next) => {
  try {
    const { brand_name, brand_slug, logo_url } = req.body;
    if (!brand_name) return res.status(400).json({ status: 'error', message: 'Tên thương hiệu không được để trống' });
    
    await db('brands').insert({ brand_name, brand_slug, logo_url });
    res.status(201).json({ status: 'success', message: 'Thêm thương hiệu thành công' });
  } catch (err) { next(err); }
};

// --- BỔ SUNG VÀO CUỐI FILE product-c.js ---

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cat_name, description } = req.body;
    
    await db('categories')
      .where('category_id', id)
      .update({ cat_name, description });
      
    res.status(200).json({ status: 'success', message: 'Cập nhật danh mục thành công' });
  } catch (err) { next(err); }
};

export const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { brand_name, brand_slug, logo_url } = req.body;
    
    await db('brands')
      .where('brand_id', id)
      .update({ brand_name, brand_slug, logo_url });
      
    res.status(200).json({ status: 'success', message: 'Cập nhật thương hiệu thành công' });
  } catch (err) { next(err); }
};