export const seed = async function(knex) {
  // 1. Dọn dẹp các bảng liên quan đến Giao dịch & Coupon
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('payments').truncate();
  await knex('order_details').truncate();
  await knex('orders').truncate();
  await knex('coupons').truncate(); // Thêm dọn dẹp bảng coupons
  await knex('system_logs').truncate();

  // 2. TẠO MÃ GIẢM GIÁ (Để test hàm f_calculate_discount_amount)
  // Lưu ý: Dùng 'quantity' và 'expired_date' để chiều theo code SQL của bạn
  await knex('coupons').insert([
    {
      code: 'WELCOME20',
      type: 'FIXED',
      value: 20000.00,
      min_order_value: 100000.00,
      quantity: 100,      // Khớp với cột quantity trong SQL
      used_count: 0,
      expired_date: '2026-12-31 23:59:59', // Khớp với cột expired_date trong SQL
      is_active: true
    }
  ]);

  // 3. Lấy ID sản phẩm mẫu (RTX 4090)
  const product = await knex('products').where('pro_sku', 'VGA-NV-4090-FE').first();
  if (!product) return; 

  const price = parseFloat(product.pro_price);

  // 4. TẠO CÁC KỊCH BẢN ĐƠN HÀNG
  const [orderIdA] = await knex('orders').insert({
    guest_name: 'Khách Hàng Thành Công',
    guest_phone: '0901111111',
    shipping_address: 'Quận 1, TP.HCM',
    total_amount: price,
    final_amount: price,
    status: 'COMPLETED'
  });

  const [orderIdB] = await knex('orders').insert({
    guest_name: 'Khách Hàng Bị Từ Chối',
    guest_phone: '0902222222',
    shipping_address: 'Quận 7, TP.HCM',
    total_amount: price,
    final_amount: price,
    status: 'CANCELLED' 
  });

  const [orderIdC] = await knex('orders').insert({
    guest_name: 'Khách Hàng Đang Giao',
    guest_phone: '0903333333',
    shipping_address: 'Quận 3, TP.HCM',
    total_amount: price,
    final_amount: price,
    status: 'SHIPPED'
  });

  // 5. CHI TIẾT ĐƠN HÀNG
  await knex('order_details').insert([
    { order_id: orderIdA, product_id: product.pro_id, quantity: 1, price_at_purchase: price, product_name_at_purchase: product.pro_name, total_line_price: price },
    { order_id: orderIdB, product_id: product.pro_id, quantity: 1, price_at_purchase: price, product_name_at_purchase: product.pro_name, total_line_price: price },
    { order_id: orderIdC, product_id: product.pro_id, quantity: 1, price_at_purchase: price, product_name_at_purchase: product.pro_name, total_line_price: price }
  ]);

  // 6. THANH TOÁN MẪU
  await knex('payments').insert([
    { order_id: orderIdA, amount: price, status: 'SUCCESS', transaction_code: 'BANK_ABC_123' },
    { order_id: orderIdB, amount: price, status: 'FAILED', transaction_code: 'ERR_404' },
    { order_id: orderIdC, amount: price, status: 'SUCCESS', transaction_code: 'VNPAY_999' }
  ]);

  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};