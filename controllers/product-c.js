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
    const { q } = req.query; 
    // SỬA: Gọi getFilteredProducts và truyền object chứa q
    const results = await productService.getFilteredProducts({ q }); 
    res.list(results, { keyword: q });
  } catch (err) {
    next(err);
  }
};