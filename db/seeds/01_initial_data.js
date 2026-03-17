import bcrypt from 'bcrypt';

export const seed = async function(knex) {
  // 1. Tắt kiểm tra khóa ngoại để dọn dẹp dữ liệu cũ mà không bị lỗi ràng buộc
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  
  await knex('product_items').truncate();
  await knex('order_details').truncate();
  await knex('orders').truncate();
  await knex('products').truncate();
  await knex('brands').truncate();
  await knex('categories').truncate();
  await knex('users').truncate();

  // 2. Tạo tài khoản Admin mẫu (Mật khẩu: admin123)
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await knex('users').insert({
    username: 'admin',
    email: 'admin@pcstore.com',
    password_hash: hashedPassword, // Khớp với DB pc_store.sql
    role: 'ADMIN',
    is_active: true
  });

  // 3. Tạo Danh mục & Thương hiệu (Dùng đúng tên cột pro_...)
  const [catId] = await knex('categories').insert({ 
    category_name: 'VGA', 
    description: 'Card đồ họa hiệu năng cao' 
  });
  const [brandId] = await knex('brands').insert({ brand_name: 'NVIDIA' });

  // 4. Tạo Sản phẩm mẫu
  const [productId] = await knex('products').insert({
    pro_name: 'GeForce RTX 4090 Founders Edition',
    pro_price: 45000000,
    pro_quantity: 10,
    pro_sku: 'VGA-NV-4090-FE',
    category_id: catId,
    brand_id: brandId,
    pro_warranty: '36 tháng'
  });

  // 5. Tạo các Serial Number (Product Items)
  // Lưu ý: status phải là 'AVAILABLE' theo ENUM trong SQL
  await knex('product_items').insert([
    { 
      product_id: productId, 
      serial_number: 'SN-4090-001', 
      status: 'AVAILABLE' 
    },
    { 
      product_id: productId, 
      serial_number: 'SN-4090-002', 
      status: 'AVAILABLE' 
    }
  ]);

  // Bật lại kiểm tra khóa ngoại sau khi hoàn tất
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};