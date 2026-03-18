USE db;

-- =============================================
-- 1. FUNCTIONS
-- =============================================
DROP FUNCTION IF EXISTS f_get_real_stock;
DELIMITER $$
CREATE FUNCTION f_get_real_stock(p_product_id INT) RETURNS INT READS SQL DATA
BEGIN
    DECLARE v_count INT;
    SELECT COUNT(*) INTO v_count FROM product_items 
    WHERE product_id = p_product_id AND status = 'IN_STOCK';
    RETURN IFNULL(v_count, 0);
END $$
DELIMITER ;

-- =============================================
-- 2. PROCEDURES (Đã sửa lỗi NULL giá tiền)
-- =============================================
DROP PROCEDURE IF EXISTS sp_create_order_safe;
DELIMITER $$
CREATE PROCEDURE sp_create_order_safe(
    IN p_name VARCHAR(100), IN p_phone VARCHAR(20), IN p_address TEXT,
    IN p_prod_id INT, IN p_qty INT
)
BEGIN
    DECLARE v_price DECIMAL(15,2);
    DECLARE v_pro_name TEXT;
    DECLARE v_order_id INT;
    DECLARE v_total DECIMAL(15,2); -- Biến tạm tính toán

    DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; SELECT 'ERROR' AS status, 'Lỗi hệ thống' AS message; END;

    START TRANSACTION;
        SELECT pro_price, pro_name INTO v_price, v_pro_name FROM products WHERE pro_id = p_prod_id;
        SET v_total = v_price * p_qty; -- Tính toán trực tiếp
        
        IF f_get_real_stock(p_prod_id) < p_qty THEN
            ROLLBACK; SELECT 'ERROR' AS status, 'Hết hàng' AS message;
        ELSE
            -- Chèn vào orders với giá trị v_total
            INSERT INTO orders (guest_name, guest_phone, shipping_address, total_amount, final_amount, status)
            VALUES (p_name, p_phone, p_address, v_total, v_total, 'COMPLETED');
            SET v_order_id = LAST_INSERT_ID();

            -- Chèn vào order_details với giá trị v_total
            INSERT INTO order_details (order_id, product_id, price_at_purchase, product_name_at_purchase, quantity, total_line_price)
            VALUES (v_order_id, p_prod_id, v_price, v_pro_name, p_qty, v_total);

            UPDATE product_items SET status = 'SOLD', order_id = v_order_id, sold_date = NOW()
            WHERE product_id = p_prod_id AND status = 'IN_STOCK' LIMIT p_qty;

            COMMIT;
            -- Trả về dữ liệu để API không bị null
            SELECT 'SUCCESS' AS status, v_order_id AS new_order_id, v_total AS final_total;
        END IF;
END $$
DELIMITER ;

-- =============================================
-- 3. TRIGGERS
-- =============================================
DROP TRIGGER IF EXISTS trg_new_order_log;
CREATE TRIGGER trg_new_order_log AFTER INSERT ON orders FOR EACH ROW 
    INSERT INTO system_logs (action_type, table_name, related_id, message)
    VALUES ('CREATE_ORDER', 'orders', NEW.order_id, CONCAT('Đơn hàng mới #', NEW.order_id));