export const seed = async function(knex) {
  // KHÔNG dùng truncate ở đây để giữ nguyên dữ liệu cũ!

  // 1. THÊM SẢN PHẨM MỚI (CPU i5 để test Upload ảnh)
  const [catCpuId] = await knex('categories').insert({ cat_name: 'CPU', description: 'Vi xử lý trung tâm' });
  const [brandIntelId] = await knex('brands').insert({ brand_name: 'INTEL' });
  
  const [cpuId] = await knex('products').insert({
    pro_name: 'Intel Core i5-13600K',
    pro_price: 7500000,
    pro_quantity: 15,
    pro_sku: 'CPU-IN-13600K',
    category_id: catCpuId,
    brand_id: brandIntelId,
    pro_warranty: '36 tháng'
  });

  // 2. THÊM MÃ GIẢM GIÁ (Mã TET2026 bạn vừa test trên Postman)
  await knex('coupons').insert({
    code: 'TET2026',
    type: 'FIXED',         // Giảm tiền mặt
    value: 500000.00,      // Giảm 500k
    min_order_value: 0.00,
    quantity: 50,
    used_count: 0,
    expired_date: '2026-12-31 23:59:59',
    is_active: true
  });

  // 3. TẠO KỊCH BẢN TEST WEBHOOK (1 Đơn hàng PENDING + Payment WAITING)
  const [orderPendingId] = await knex('orders').insert({
    guest_name: 'Khách Đang Chờ Ting Ting',
    guest_phone: '0908888888',
    shipping_address: 'Quận 5, TP.HCM',
    total_amount: 7500000,
    final_amount: 7000000, // Đã áp mã giảm 500k
    status: 'PENDING'      // Đơn hàng đang chờ
  });

  await knex('order_details').insert({
    order_id: orderPendingId,
    product_id: cpuId,
    quantity: 1,
    price_at_purchase: 7500000,
    product_name_at_purchase: 'Intel Core i5-13600K',
    total_line_price: 7500000
  });

  // Lưu ý: paymentId của cái này khả năng cao sẽ là 4 (vì file 02 đã tạo 3 cái)
  await knex('payments').insert({
    order_id: orderPendingId,
    amount: 7000000,
    status: 'PENDING',     // Thanh toán đang chờ
    transaction_code: null
  });

  console.log('✅ Đã nạp thành công giá sản phẩm linh kiện PC thanh toán');
};