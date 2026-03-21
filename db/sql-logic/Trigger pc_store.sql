/* ==========================================================================
   FILE: Trigger pc_store.sql
   MÔ TẢ: Tự động đồng bộ kho tổng và kho items (Serial)
   ========================================================================== */
-- USE pc_store;

DELIMITER $$

-- 1. Trigger: Trừ kho tổng khi tạo đơn hàng mới
DROP TRIGGER IF EXISTS trg_reduce_stock_insert $$
CREATE TRIGGER trg_reduce_stock_insert
AFTER INSERT ON order_details
FOR EACH ROW
BEGIN
    UPDATE products 
    SET pro_quantity = pro_quantity - NEW.quantity 
    WHERE pro_id = NEW.product_id;
END $$

-- 2. Trigger: Xử lý khi HỦY ĐƠN (Hoàn kho tổng & Reset Serial)
DROP TRIGGER IF EXISTS trg_restore_stock_cancel $$
CREATE TRIGGER trg_restore_stock_cancel
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'CANCELLED' AND OLD.status != 'CANCELLED' THEN
        -- Hoàn kho
        UPDATE products p 
        JOIN order_details od ON p.pro_id = od.product_id
        SET p.pro_quantity = p.pro_quantity + od.quantity
        WHERE od.order_id = NEW.order_id;
        
        -- Reset Serial
        UPDATE product_items 
        SET status = 'IN_STOCK', order_id = NULL, sold_date = NULL
        WHERE order_id = NEW.order_id;
    END IF;
END $$

-- 3. Trigger: Ghi Log hệ thống
DROP TRIGGER IF EXISTS trg_new_order_log $$
CREATE TRIGGER trg_new_order_log
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    INSERT INTO system_logs (action_type, related_id, message)
    VALUES ('ORDER', NEW.order_id, CONCAT('Đơn hàng mới #', NEW.order_id, ' được tạo bởi ', NEW.guest_name));
END $$


DELIMITER ;