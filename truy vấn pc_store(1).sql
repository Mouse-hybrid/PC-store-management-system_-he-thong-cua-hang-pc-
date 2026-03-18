/* ==========================================================================
   FILE: truy vấn pc_store(1).sql
   MÔ TẢ: Tập hợp các câu truy vấn nghiệp vụ thường dùng
   ========================================================================== */
USE pc_store;

-- 1. [QUAN TRỌNG] TRUY VẤN SERIAL NUMBER ĐỂ BẢO HÀNH
-- Input: Mã thanh toán (payment_id) -> Output: Danh sách Serial của các món trong đơn đó
SELECT 
    p.payment_id AS 'Mã Giao Dịch',
    o.order_id AS 'Mã Đơn',
    o.guest_name AS 'Khách Hàng',
    o.created_at AS 'Ngày Mua',
    prod.pro_name AS 'Sản Phẩm',
    item.serial_number AS 'Serial/IMEI (Bảo Hành)', 
    item.status AS 'Trạng Thái Item'
FROM payments p
JOIN orders o ON p.order_id = o.order_id
JOIN product_items item ON o.order_id = item.order_id -- JOIN vào bảng Item qua OrderID
JOIN products prod ON item.product_id = prod.pro_id
WHERE p.payment_id = 1; -- <--- Thay số 1 bằng mã thanh toán thực tế

-- 2. KIỂM TRA KHO SERIAL (Chi tiết từng món còn trong kho)
SELECT 
    prod.pro_name, 
    COUNT(item.serial_number) as 'Số lượng còn',
    GROUP_CONCAT(item.serial_number SEPARATOR ', ') as 'Danh sách Serial'
FROM product_items item
JOIN products prod ON item.product_id = prod.pro_id
WHERE item.status = 'AVAILABLE'
GROUP BY prod.pro_name;

-- 3. BÁO CÁO DOANH THU (Từ View đã tạo)
SELECT * FROM v_daily_revenue;

-- 4. XEM DỮ LIỆU TỔNG QUAN CÁC BẢNG CHÍNH
SELECT '--- USERS ---' AS Table_Name; SELECT * FROM users LIMIT 5;
SELECT '--- PRODUCTS ---' AS Table_Name; SELECT * FROM products LIMIT 5;
SELECT '--- ORDERS ---' AS Table_Name; SELECT * FROM orders LIMIT 5;
SELECT '--- ITEMS ---' AS Table_Name; SELECT * FROM product_items LIMIT 5;