/* ==========================================================================
   FILE: Views_Procedures pc_store.sql
   MÔ TẢ: Chứa Views báo cáo và Stored Procedures xử lý logic nghiệp vụ
   ========================================================================== */
-- USE pc_store;

-- ==========================================================================
-- 1. VIEWS (Không cần DELIMITER)
-- ==========================================================================

CREATE OR REPLACE VIEW v_bill_details AS
SELECT 
    o.order_id, o.created_at, o.guest_name, 
    p.pro_name, od.quantity, 
    od.total_line_price,   -- [ĐÃ SỬA] Chỉ gọi 1 lần
    o.total_amount,        -- tổng tiền gốc
    o.final_amount,        -- tổng tiền sau giảm giá
    o.status
FROM orders o 
JOIN order_details od ON o.order_id = od.order_id
JOIN products p ON od.product_id = p.pro_id;

CREATE OR REPLACE VIEW v_daily_revenue AS
SELECT 
    DATE(created_at) as date, 
    COUNT(order_id) as total_orders,
    SUM(final_amount) as revenue 
FROM orders 
WHERE status = 'COMPLETED' 
GROUP BY DATE(created_at);

-- ==========================================================================
-- 2. STORED PROCEDURES (Bắt buộc dùng DELIMITER)
-- ==========================================================================

DELIMITER $$

-- [THỦ TỤC 1] Nhập hàng an toàn
DROP PROCEDURE IF EXISTS sp_import_product_safe $$
CREATE PROCEDURE sp_import_product_safe(
    IN p_sku VARCHAR(50), IN p_name TEXT, IN p_price DECIMAL(15,2), 
    IN p_qty INT, IN p_brand INT, IN p_cat INT, IN p_desc TEXT
)
BEGIN
    DECLARE v_pro_id INT;
    DECLARE i INT DEFAULT 1;

    START TRANSACTION;
        INSERT INTO products (pro_sku, pro_name, pro_price, pro_quantity, brand_id, category_id, description)
        VALUES (p_sku, p_name, p_price, p_qty, p_brand, p_cat, p_desc)
        ON DUPLICATE KEY UPDATE 
            pro_quantity = pro_quantity + p_qty, pro_price = p_price;
            
        SELECT pro_id INTO v_pro_id FROM products WHERE pro_sku = p_sku;
        
        WHILE i <= p_qty DO
            INSERT INTO product_items (product_id, serial_number, status, import_date)
            VALUES (v_pro_id, CONCAT(p_sku, '-IMP-', UUID_SHORT()), 'IN_STOCK', NOW());
            SET i = i + 1;
        END WHILE;
    COMMIT;
    
    SELECT 'SUCCESS' AS status, CONCAT('Đã nhập thêm ', p_qty, ' sản phẩm.') AS message;
END $$

-- [THỦ TỤC 2] Tạo đơn hàng
DROP PROCEDURE IF EXISTS sp_create_order_safe $$
CREATE PROCEDURE sp_create_order_safe(
    IN p_user_id INT, 
    IN p_name VARCHAR(100), 
    IN p_phone VARCHAR(20), 
    IN p_addr TEXT, 
    IN p_prod_id INT, 
    IN p_qty INT,
    IN p_coupon_code VARCHAR(50) 
)
BEGIN
    DECLARE v_stock INT;
    DECLARE v_price DECIMAL(15,2);
    DECLARE v_pro_name TEXT;
    DECLARE v_order_id INT;
    
    DECLARE v_total DECIMAL(15,2);
    DECLARE v_discount DECIMAL(15,2) DEFAULT 0;
    DECLARE v_final DECIMAL(15,2);

    START TRANSACTION;
        -- 1. Lấy thông tin sản phẩm
        SELECT pro_quantity, pro_price, pro_name 
        INTO v_stock, v_price, v_pro_name 
        FROM products WHERE pro_id = p_prod_id;
        
        IF v_stock < p_qty THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không đủ hàng tồn kho để bán!';
        ELSE
            -- 2. TÍNH TIỀN VÀ GIẢM GIÁ
            SET v_total = v_price * p_qty;
            
            IF p_coupon_code IS NOT NULL AND p_coupon_code != '' THEN
                SET v_discount = f_calculate_discount_amount(v_total, p_coupon_code);
            END IF;
            
            SET v_final = v_total - v_discount;
            IF v_final < 0 THEN SET v_final = 0; END IF;

            -- 3. Tạo hóa đơn
            INSERT INTO orders (user_id, guest_name, guest_phone, shipping_address, total_amount, final_amount, status)
            VALUES (p_user_id, p_name, p_phone, p_addr, v_total, v_final, 'PENDING');
            SET v_order_id = LAST_INSERT_ID();

            -- 4. Tạo chi tiết đơn hàng (ĐÃ FIX: Bổ sung cột total_line_price)
            INSERT INTO order_details (order_id, product_id, price_at_purchase, product_name_at_purchase, quantity, total_line_price)
            VALUES (v_order_id, p_prod_id, v_price, v_pro_name, p_qty, v_total);

            -- 5. Thanh toán lưu theo số tiền thực thu
            INSERT INTO payments (order_id, amount, status, method_id) 
            VALUES (v_order_id, v_final, 'SUCCESS', 1);
            
            -- 6. Trừ kho vật lý
            UPDATE product_items 
            SET status = 'SOLD', order_id = v_order_id, sold_date = NOW()
            WHERE product_id = p_prod_id AND status = 'IN_STOCK'
            LIMIT p_qty;
            
            -- 7. CẬP NHẬT LƯỢT DÙNG COUPON
            IF v_discount > 0 THEN
                UPDATE coupons SET used_count = used_count + 1 WHERE code = p_coupon_code;
            END IF;
            
            -- [ĐÃ FIX] Trả đủ 3 biến tiền về cho Node.js
            SELECT 'SUCCESS' AS status, v_order_id AS new_order_id, v_total AS total_amount, v_final AS final_amount;
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

DELIMITER ;