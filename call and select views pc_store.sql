/* ==========================================================================
   FILE: call and select views pc_store.sql
   MÔ TẢ: Script chạy thử nghiệm các tính năng View và Procedure
   ========================================================================== */
USE pc_store;

-- 1. TEST VIEW: Xem chi tiết các hóa đơn hiện có
SELECT * FROM v_bill_details;

-- 2. TEST NHẬP HÀNG: Nhập thêm hàng mới và kiểm tra sinh Serial
-- Kịch bản: Nhập thêm 2 cái iPhone 15 Pro Max
CALL sp_import_product_safe(
    'IPHONE-15',          -- SKU (Trùng SKU cũ để cộng dồn)
    'iPhone 15 Pro Max',  -- Tên
    30000000,             -- Giá
    2,                    -- Số lượng nhập thêm
    3,                    -- Brand ID (Apple)
    3,                    -- Cat ID (Phone)
    'Hàng nhập thêm'      -- Mô tả
);

-- Kiểm tra xem đã sinh ra 2 dòng serial mới có chữ '-IMP-' chưa
SELECT * FROM product_items WHERE serial_number LIKE '%-IMP-%' ORDER BY item_id DESC LIMIT 5;

-- 3. TEST BÁN HÀNG: Tạo đơn hàng và kiểm tra gán Serial
-- Kịch bản: Bán 1 cái iPhone 15 vừa nhập cho khách
CALL sp_create_order_safe(
    'Khách Test VIP',     -- Tên khách
    '0909123123',         -- SĐT
    'Landmark 81, HCM',   -- Địa chỉ
    2,                    -- ID Sản phẩm (iPhone 15, giả sử ID là 2)
    1                     -- Số lượng mua
);

-- 4. KIỂM TRA KẾT QUẢ CUỐI CÙNG
-- Lấy đơn hàng mới nhất vừa tạo
SELECT @last_order := MAX(order_id) FROM orders;

-- Xem serial nào đã được gán cho đơn hàng đó (Status phải là SOLD)
SELECT * FROM product_items WHERE order_id = @last_order;

/* 
   FILE: call and select views pc_store.sql
   MÔ TẢ: Script chạy thử nghiệm các tính năng, View và Tìm kiếm dữ liệu
   */

-- 1. TEST VIEW: Xem chi tiết các hóa đơn hiện có
SELECT * FROM v_bill_details;

-- 2. TEST NHẬP HÀNG: Nhập thêm hàng mới và kiểm tra sinh Serial
-- Kịch bản: Nhập thêm 2 cái iPhone 15 Pro Max
CALL sp_import_product_safe(
    'IPHONE-15',          -- SKU (Trùng SKU cũ để cộng dồn)
    'iPhone 15 Pro Max',  -- Tên
    30000000,             -- Giá
    2,                    -- Số lượng nhập thêm
    3,                    -- Brand ID (Apple)
    3,                    -- Cat ID (Phone)
    'Hàng nhập thêm'      -- Mô tả
);

-- Kiểm tra xem đã sinh ra 2 dòng serial mới có chữ '-IMP-' chưa
SELECT * FROM product_items WHERE serial_number LIKE '%-IMP-%' ORDER BY item_id DESC LIMIT 5;

-- 3. TEST BÁN HÀNG: Tạo đơn hàng và kiểm tra gán Serial
-- Kịch bản: Bán 1 cái iPhone 15 vừa nhập cho khách
CALL sp_create_order_safe(
    'Khách Test VIP',     -- Tên khách
    '0909123123',         -- SĐT
    'Landmark 81, HCM',   -- Địa chỉ
    2,                    -- ID Sản phẩm (iPhone 15, giả sử ID là 2)
    1                     -- Số lượng mua
);

-- 4. KIỂM TRA KẾT QUẢ ĐƠN HÀNG
-- Lấy đơn hàng mới nhất vừa tạo
SELECT @last_order := MAX(order_id) FROM orders;
-- Xem serial nào đã được gán cho đơn hàng đó (Status phải là SOLD)
SELECT * FROM product_items WHERE order_id = @last_order;

-- ==========================================================================
-- 5. TEST SELECT SẢN PHẨM (THEO YÊU CẦU CỦA BẠN)
-- ==========================================================================

-- Cách 1: Nếu bạn muốn tìm chính xác tên "Asus TUF Gaming F15 FX507ZC i5-12500H RTX 3050" (hien ra co)
SELECT * FROM products WHERE pro_name = 'Asus TUF Gaming F15 FX507ZC i5-12500H RTX 3050';

-- Cách 2: Nếu bạn chỉ nhớ mang máng tên (Ví dụ tìm tất cả cái gì có chữ 'Dell')
SELECT * FROM products WHERE pro_name LIKE '%Dell%';

-- Cách 3: Dùng Procedure Tìm kiếm nâng cao (Fulltext Search) đã tạo
-- Tìm kiếm thông minh: Tìm tất cả sản phẩm liên quan đến "Gaming" hoặc "Asus"
CALL sp_search_product_status('Gaming');