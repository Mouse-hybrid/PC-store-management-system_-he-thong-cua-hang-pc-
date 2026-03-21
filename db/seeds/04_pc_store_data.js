// db/seeds/04_pc_store_data.js

export const seed = async function(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0;');
  // 1. Xóa dữ liệu cũ (Xóa theo thứ tự ngược để không dính Khóa ngoại)
  await knex('products').del();
  await knex('brands').del();
  await knex('categories').del();

  // 2. Nạp dữ liệu Danh mục (Categories)
  await knex('categories').insert([
    { category_id: 1, cat_name: 'CPU - Bộ vi xử lý' },
    { category_id: 2, cat_name: 'VGA - Card màn hình' },
    { category_id: 3, cat_name: 'Mainboard - Bo mạch chủ' }
  ]);

  // 3. Nạp dữ liệu Thương hiệu (Brands)
  await knex('brands').insert([
    { brand_id: 1, brand_name: 'Intel' },
    { brand_id: 2, brand_name: 'AMD' },
    { brand_id: 3, brand_name: 'NVIDIA' },
    { brand_id: 4, brand_name: 'ASUS' },
    { brand_id: 5, brand_name: 'GIGABYTE' }
  ]);

  // 4. Nạp dàn Sản phẩm siêu xịn (Products)
  await knex('products').insert([
    { pro_id: 1, pro_name: 'CPU Intel Core i9 14900K', pro_price: 15000000, pro_quantity: 50, brand_id: 1, category_id: 1 },
    { pro_id: 2, pro_name: 'CPU AMD Ryzen 9 7950X', pro_price: 14500000, pro_quantity: 50, brand_id: 2, category_id: 1 },
    { pro_id: 3, pro_name: 'VGA ASUS ROG Strix RTX 4090 24GB', pro_price: 55000000, pro_quantity: 50, brand_id: 4, category_id: 2 },
    { pro_id: 4, pro_name: 'VGA GIGABYTE AORUS RTX 4080 Super', pro_price: 28000000, pro_quantity: 50, brand_id: 5, category_id: 2 },
    { pro_id: 5, pro_name: 'Mainboard ASUS ROG Maximus Z790 Dark Hero', pro_price: 18000000, pro_quantity: 50, brand_id: 4, category_id: 3 },
    { pro_id: 6, pro_name: 'CPU Intel Core i7 13700K', pro_price: 10500000, pro_quantity: 50, brand_id: 1, category_id: 1 },
    { pro_id: 7, pro_name: 'VGA NVIDIA GeForce RTX 4070 Ti', pro_price: 22000000, pro_quantity: 50, brand_id: 3, category_id: 2 }
  ]);
  
  // BẬT LẠI KIỂM TRA KHÓA NGOẠI (RẤT QUAN TRỌNG)
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1;');

  console.log('✅ Đã nạp thành công 7 sản phẩm linh kiện PC vào Database!');
};