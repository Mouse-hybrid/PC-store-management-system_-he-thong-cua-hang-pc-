import db from '../db/db.js';

class ProductItem {
  static async findBySerial(serial) {
    return db('product_items').where('serial_number', serial).first(); //
  }

  static async getWarrantyInfo(serial) {
    return db('product_items as i')
      .select('i.serial_number', 'i.status', 'i.sold_date', 'p.pro_name', 'p.pro_warranty')
      .join('products as p', 'i.product_id', 'p.pro_id')
      .where('i.serial_number', serial)
      .first();
  }
}
export default ProductItem;