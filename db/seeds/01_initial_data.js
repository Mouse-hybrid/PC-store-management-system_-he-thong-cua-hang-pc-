<<<<<<< HEAD
import bcrypt from 'bcryptjs';

export const seed = async function(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  
  // Dọn dẹp các bảng
=======
import bcrypt from 'bcrypt';

export const seed = async function(knex) {
  // 1. Tắt kiểm tra khóa ngoại để dọn dẹp dữ liệu cũ mà không bị lỗi ràng buộc
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
  await knex('product_items').truncate();
  await knex('order_details').truncate();
  await knex('orders').truncate();
  await knex('products').truncate();
  await knex('brands').truncate();
  await knex('categories').truncate();
  await knex('users').truncate();

<<<<<<< HEAD
  const adminPassword = await bcrypt.hash('admin123', 12);
  const staffPassword = await bcrypt.hash('staff123', 12);

  // 1. Chèn Admin (Đã chạy ok)
  await knex('users').insert({
    username: 'admin',
    email: 'admin@pcstore.com',
    password_hash: adminPassword,
=======
  // 2. Tạo tài khoản Admin mẫu (Mật khẩu: admin123)
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await knex('users').insert({
    username: 'admin',
    email: 'admin@pcstore.com',
    password_hash: hashedPassword, // Khớp với DB pc_store.sql
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
    role: 'ADMIN',
    is_active: true
  });

<<<<<<< HEAD
  // 2. Chèn Staff (ĐÃ BỎ full_name ĐỂ KHÔNG BỊ LỖI)
  await knex('users').insert({
    username: 'staff01',
    email: 'staff@gmail.com',
    password_hash: staffPassword, 
    role: 'STAFF',
    is_active: true 
  });

  // 3. Tạo Danh mục & Thương hiệu
  const [catId] = await knex('categories').insert({ 
    cat_name: 'VGA', 
=======
  // 3. Tạo Danh mục & Thương hiệu (Dùng đúng tên cột pro_...)
  const [catId] = await knex('categories').insert({ 
    category_name: 'VGA', 
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
    description: 'Card đồ họa hiệu năng cao' 
  });
  const [brandId] = await knex('brands').insert({ brand_name: 'NVIDIA' });

<<<<<<< HEAD
  // 4. Tạo Sản phẩm mẫu (Số lượng: 10)
=======
  // 4. Tạo Sản phẩm mẫu
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
  const [productId] = await knex('products').insert({
    pro_name: 'GeForce RTX 4090 Founders Edition',
    pro_price: 45000000,
    pro_quantity: 10,
    pro_sku: 'VGA-NV-4090-FE',
    category_id: catId,
    brand_id: brandId,
    pro_warranty: '36 tháng'
  });

<<<<<<< HEAD
  // 5. Tạo các Serial Number (Khớp đủ 10 món cho kho hàng)
  const productItems = [];
  for (let i = 1; i <= 5; i++) { // SỬA: Chạy đến 10 thay vì 5
    productItems.push({
      product_id: productId,
      serial_number: `SN-4090-${i.toString().padStart(3, '0')}`,
      status: 'IN_STOCK'
    });
  }
  await knex('product_items').insert(productItems);

  // Bật lại kiểm tra khóa ngoại
=======
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
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};