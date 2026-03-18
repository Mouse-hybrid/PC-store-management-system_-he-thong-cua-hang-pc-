/* ==========================================================================
   FILE: Views_Procedures pc_store.sql
   MÔ TẢ: Chứa Views báo cáo và Stored Procedures xử lý logic nghiệp vụ
   ========================================================================== */
-- USE pc_store;

-- ==========================================================================
-- 1. VIEWS (Góc nhìn dữ liệu)
-- ==========================================================================

-- View xem chi tiết hóa đơn dạng bảng
CREATE OR REPLACE VIEW v_bill_details AS
SELECT 
    o.order_id, 
    o.created_at, 
    o.guest_name, 
    p.pro_name, 
    od.quantity, 
    od.total_line_price,
    o.status
FROM orders o 
JOIN order_details od ON o.order_id = od.order_id
JOIN products p ON od.product_id = p.pro_id;

-- View báo cáo doanh thu theo ngày (Chỉ tính đơn thành công)
CREATE OR REPLACE VIEW v_daily_revenue AS
SELECT 
    DATE(created_at) as date, 
    COUNT(order_id) as total_orders,
    SUM(final_amount) as revenue 
FROM orders 
WHERE status = 'COMPLETED' 
GROUP BY DATE(created_at);

-- ==========================================================================
-- 2. STORED PROCEDURES (Thủ tục xử lý)
-- ==========================================================================

DELIMITER $$

-- [THỦ TỤC 1] Nhập hàng an toàn (Tự động sinh Serial cho hàng mới nhập)
DROP PROCEDURE IF EXISTS sp_import_product_safe $$
CREATE PROCEDURE sp_import_product_safe(
    IN p_sku VARCHAR(50), 
    IN p_name TEXT, 
    IN p_price DECIMAL(15,2), 
    IN p_qty INT, 
    IN p_brand INT, 
    IN p_cat INT, 
    IN p_desc TEXT
)
BEGIN
    DECLARE v_pro_id INT;
    DECLARE i INT DEFAULT 1;

    START TRANSACTION;
        -- 1. Upsert vào bảng Products (Nếu có rồi thì cộng dồn số lượng)
        INSERT INTO products (pro_sku, pro_name, pro_price, pro_quantity, brand_id, category_id, description)
        VALUES (p_sku, p_name, p_price, p_qty, p_brand, p_cat, p_desc)
        ON DUPLICATE KEY UPDATE 
            pro_quantity = pro_quantity + p_qty, 
            pro_price = p_price;
            
        -- 2. Lấy ID sản phẩm
        SELECT pro_id INTO v_pro_id FROM products WHERE pro_sku = p_sku;
        
        -- 3. Sinh Serial Number cho số lượng vừa nhập thêm
        -- Sử dụng UUID_SHORT() để đảm bảo mã nhập sau không trùng mã cũ
        WHILE i <= p_qty DO
            INSERT INTO product_items (product_id, serial_number, status, import_date)
            VALUES (v_pro_id, CONCAT(p_sku, '-IMP-', UUID_SHORT()), 'AVAILABLE', NOW());
            SET i = i + 1;
        END WHILE;
        
    COMMIT;
    SELECT 'SUCCESS' AS status, CONCAT('Đã nhập thêm ', p_qty, ' sản phẩm và sinh mã Serial thành công.') AS message;
END $$

-- [THỦ TỤC 2] Tạo đơn hàng (Tự động lấy Serial trong kho gán cho khách)
USE pc_store;

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_create_order_safe $$
CREATE PROCEDURE sp_create_order_safe(
	IN p_user_id INT, -- THÊM DÒNG NÀY
    IN p_name VARCHAR(100), 
    IN p_phone VARCHAR(20), 
    IN p_addr TEXT, 
    IN p_prod_id INT, 
    IN p_qty INT
)
BEGIN
    DECLARE v_stock INT;
    DECLARE v_price DECIMAL(15,2);
    DECLARE v_pro_name TEXT; -- [MỚI] Biến lưu tên sản phẩm
    DECLARE v_order_id INT;

    START TRANSACTION;
        -- 1. Lấy thông tin sản phẩm ra biến TRƯỚC (Tách biệt việc đọc dữ liệu)
        SELECT pro_quantity, pro_price, pro_name 
        INTO v_stock, v_price, v_pro_name 
        FROM products 
        WHERE pro_id = p_prod_id;
        
        -- Kiểm tra tồn kho
        IF v_stock < p_qty THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không đủ hàng tồn kho để bán!';
        ELSE
            -- 2. Tạo đơn hàng (Master)
            INSERT INTO orders (user_id, guest_name, guest_phone, shipping_address, total_amount, final_amount, status)
            VALUES (p_user_id ,p_name, p_phone, p_addr, v_price * p_qty, v_price * p_qty, 'COMPLETED');
            SET v_order_id = LAST_INSERT_ID();

            -- 3. Tạo chi tiết đơn hàng (Detail)
            -- [FIX LỖI 1442] Dùng VALUES với biến đã lấy, KHÔNG SELECT trực tiếp từ bảng products nữa
            INSERT INTO order_details (order_id, product_id, price_at_purchase, product_name_at_purchase, quantity)
            VALUES (v_order_id, p_prod_id, v_price, v_pro_name, p_qty);

            -- 4. Tạo thanh toán (Payment)
            INSERT INTO payments (order_id, amount, status, method_id) 
            VALUES (v_order_id, v_price * p_qty, 'SUCCESS', 1);
            
            -- 5. Cập nhật bảng Items (Serial)
            UPDATE product_items 
            SET status = 'SOLD', order_id = v_order_id, sold_date = NOW()
            WHERE product_id = p_prod_id AND status = 'IN_STOCK'
            LIMIT p_qty;
            
            SELECT 'SUCCESS' AS status, v_order_id AS new_order_id;
        END IF;
    COMMIT;
END $$


-- [THỦ TỤC 3] Tìm kiếm sản phẩm
DROP PROCEDURE IF EXISTS sp_search_product_status $$
CREATE PROCEDURE sp_search_product_status(IN p_keyword VARCHAR(255))
BEGIN
    SELECT * FROM products 
    WHERE MATCH(pro_name, description) AGAINST(p_keyword IN BOOLEAN MODE);
END $$

CREATE OR REPLACE VIEW v_bill_details AS
SELECT o.order_id, o.user_id, o.guest_name, o.guest_phone, o.shipping_address, o.total_amount, o.final_amount AS total, o.status AS order_status, o.created_at, od.product_id, p.pro_name AS product_name_at_purchase, od.quantity, od.price_at_purchase, od.total_line_price
FROM orders o
JOIN order_details od ON o.order_id = od.order_id
JOIN products p ON od.product_id = p.pro_id;

DELIMITER ;