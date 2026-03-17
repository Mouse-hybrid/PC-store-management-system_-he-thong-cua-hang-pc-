import * as productService from '../services/product-s.js';

export const checkWarranty = async (req, res, next) => {
  try {
    const { serial } = req.params;
    const warrantyInfo = await productService.getInventoryBySerial(serial);
    res.ok(warrantyInfo, 'Thông tin bảo hành linh kiện');
  } catch (err) {
    next(err);
  }
};