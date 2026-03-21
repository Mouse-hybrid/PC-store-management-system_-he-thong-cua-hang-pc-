/* ==========================================================================
   FILE: Functions pc_store.sql
   MÔ TẢ: Các hàm tính toán bổ trợ (Helper Functions)
   ========================================================================== */
-- USE pc_store;

DELIMITER $$

-- 1. HÀM KIỂM TRA TỒN KHO THỰC TẾ
DROP FUNCTION IF EXISTS f_get_real_stock $$

CREATE FUNCTION f_get_real_stock(p_id INT) RETURNS INT
READS SQL DATA
BEGIN
    DECLARE total_stock INT;
    DECLARE ordered_stock INT;

    -- Lấy tổng số lượng vật lý trong kho
    SELECT IFNULL(pro_quantity, 0) INTO total_stock 
    FROM products WHERE pro_id = p_id;

    -- Lấy số lượng đang bị giam trong các đơn hàng chưa giao
    -- [ĐÃ FIX CHUẨN]: Đổi o.id thành o.order_id
    SELECT IFNULL(SUM(quantity), 0) INTO ordered_stock
    FROM order_details od
    JOIN orders o ON od.order_id = o.order_id
    WHERE od.product_id = p_id AND o.status IN ('PENDING', 'PROCESSING');

    -- Trả về tồn kho thực tế
    RETURN total_stock - ordered_stock;
END $$
-- 2. HÀM TÍNH SỐ TIỀN GIẢM GIÁ
DROP FUNCTION IF EXISTS f_calculate_discount_amount $$
CREATE FUNCTION f_calculate_discount_amount(p_total_order DECIMAL(15,2), p_code VARCHAR(50)) 
RETURNS DECIMAL(15,2)
READS SQL DATA
BEGIN
    DECLARE v_discount DECIMAL(15,2);
    DECLARE v_min_order DECIMAL(15,2);
    DECLARE v_expiry DATETIME;
    DECLARE v_qty INT;
    DECLARE v_used INT;
    DECLARE v_is_active TINYINT;
    DECLARE v_type VARCHAR(50);

    -- 1. SỬA TÊN CỘT: value, code, is_active, type cho khớp với ảnh của bạn
    SELECT value, min_order_value, expired_date, quantity, used_count, is_active, type
    INTO v_discount, v_min_order, v_expiry, v_qty, v_used, v_is_active, v_type
    FROM coupons 
    WHERE code = p_code;

    -- 2. CÁC BƯỚC KIỂM TRA (VALIDATION)
    -- Nếu không tìm thấy coupon -> Giảm 0đ
    IF v_discount IS NULL THEN 
        RETURN 0;
    END IF;

    -- Kiểm tra mã có đang được bật không? (Dựa vào cột is_active)
    IF v_is_active = 0 THEN 
        RETURN 0;
    END IF;

    -- Hết hạn chưa?
    IF NOW() > v_expiry THEN 
        RETURN 0;
    END IF;

    -- Đã hết lượt dùng chưa?
    IF v_used >= v_qty THEN 
        RETURN 0;
    END IF;

    -- Đơn hàng có đủ giá trị tối thiểu không?
    IF p_total_order < v_min_order THEN 
        RETURN 0;
    END IF;

    -- 3. TÍNH TOÁN DỰA TRÊN LOẠI MÃ (Dựa vào cột type)
    -- Giả sử type là 'PERCENT' thì giảm theo phần trăm, còn lại giảm thẳng tiền mặt
    IF v_type = 'PERCENT' THEN
        RETURN (p_total_order * v_discount) / 100;
    ELSE
        RETURN v_discount;
    END IF;

END $$

-- 3. HÀM LẤY TRẠNG THÁI HIỂN THỊ CỦA SẢN PHẨM
DROP FUNCTION IF EXISTS f_get_product_status_label $$
CREATE FUNCTION f_get_product_status_label(p_qty INT) 
RETURNS VARCHAR(50)
DETERMINISTIC
BEGIN
    IF p_qty <= 0 THEN
        RETURN 'Hết hàng (Out of Stock)';
    ELSEIF p_qty < 5 THEN
        RETURN 'Sắp hết (Low Stock)';
    ELSE
        RETURN 'Sẵn sàng (In Stock)';
    END IF;
END $$

DELIMITER ;

-- ==========================================================================
-- TEST HÀM (USE FUNCTION EXAMPLES)
-- ==========================================================================

-- Test hàm 1 & 3: Lấy trạng thái của toàn bộ sản phẩm
SELECT 
    pro_name,
    f_get_real_stock(pro_id) AS 'Tồn kho thực tế', 
    f_get_product_status_label(f_get_real_stock(pro_id)) AS 'Trạng thái' 
FROM products;

-- Test hàm 2: Giả sử khách mua 200k, nhập mã 'WELCOME20'
SELECT f_calculate_discount_amount(200000, 'WELCOME20') AS 'Tiền được giảm';

-- Test hàm 2: Giả sử khách mua 50k (không đủ điều kiện tối thiểu 100k của mã WELCOME20)
SELECT f_calculate_discount_amount(50000, 'WELCOME20') AS 'Tiền được giảm';