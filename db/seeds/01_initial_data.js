import bcrypt from 'bcryptjs';

export const seed = async function(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  
  // Dọn dẹp các bảng
  await knex('product_items').truncate();
  await knex('order_details').truncate();
  await knex('orders').truncate();
  await knex('products').truncate();
  await knex('brands').truncate();
  await knex('categories').truncate();
  await knex('users').truncate();

  const adminPassword = await bcrypt.hash('admin123', 12);
  const staffPassword = await bcrypt.hash('staff123', 12);
  const memberPassword = await bcrypt.hash('member123', 12);
  // 1. Chèn Admin (Đã chạy ok)
  await knex('users').insert({
    username: 'admin',
    email: 'admin@pcstore.com',
    password_hash: adminPassword,
    role: 'ADMIN',
    is_active: true
  });

  // 2. Chèn Staff (ĐÃ BỎ full_name ĐỂ KHÔNG BỊ LỖI)
  await knex('users').insert({
    username: 'staff01',
    email: 'staff@gmail.com',
    password_hash: staffPassword, 
    role: 'STAFF',
    is_active: true 
  });

  await knex('users').insert({
    username: 'member1',
    email: 'member@gmail.com',
    password_hash: memberPassword,
    role: 'MEMBER',
    is_active: true
  })

  // 3. Tạo Danh mục & Thương hiệu
  const [catId] = await knex('categories').insert({ 
    cat_name: 'VGA', 
    description: 'Card đồ họa hiệu năng cao' 
  });
  const [brandId] = await knex('brands').insert({ brand_name: 'NVIDIA' });

  // 4. Tạo Sản phẩm mẫu (Số lượng: 10)
  const [productId] = await knex('products').insert({
    pro_name: 'GeForce RTX 4090 Founders Edition',
    pro_price: 45000000,
    pro_quantity: 10,
    pro_sku: 'VGA-NV-4090-FE',
    category_id: catId,
    brand_id: brandId,
    pro_warranty: '36 tháng'
  });

  // 5. Tạo các Serial Number (Khớp đủ 5 món cho kho hàng)
  const productItems = [];
  for (let i = 1; i <= 5; i++) { // SỬA: Chạy đến 5 thay vì 10
    productItems.push({
      product_id: productId,
      serial_number: `SN-4090-${i.toString().padStart(3, '0')}`,
      status: 'IN_STOCK'
    });
  }
  await knex('product_items').insert(productItems);

  // Bật lại kiểm tra khóa ngoại
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
  console.log('✅ Đã nạp thành công dữ liệu mẫu đầu tiên');
};