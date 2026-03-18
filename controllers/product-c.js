import * as productService from '../services/product-s.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.listAllProducts();
    res.list(products, { count: products.length });
  } catch (err) {
    next(err);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
<<<<<<< HEAD
    const { q } = req.query; 
    // SỬA: Gọi getFilteredProducts và truyền object chứa q
    const results = await productService.getFilteredProducts({ q }); 
=======
    const { q } = req.query; // q là keyword từ khách hàng
    const results = await productService.searchProducts(q);
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
    res.list(results, { keyword: q });
  } catch (err) {
    next(err);
  }
};