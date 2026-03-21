/* ==========================================================================
   FILE: Functions pc_store.sql
   MÔ TẢ: Các hàm tính toán bổ trợ (Helper Functions)
   ========================================================================== */
USE pc_store;

DELIMITER $$

-- 1. HÀM KIỂM TRA TỒN KHO THỰC TẾ (Real-time Stock Check)
-- Tác dụng: Đếm trực tiếp trong bảng Items xem còn bao nhiêu cái status='AVAILABLE'
-- Lý do cần: Đôi khi cột pro_quantity ở bảng products có thể bị lệch, hàm này là chốt chặn cuối cùng.
DROP FUNCTION IF EXISTS f_get_real_stock $$
CREATE FUNCTION f_get_real_stock(p_product_id INT) 
RETURNS INT
READS SQL DATA
BEGIN
    DECLARE v_count INT;
    
    SELECT COUNT(*) INTO v_count 
    FROM product_items 
    WHERE product_id = p_product_id AND status = 'AVAILABLE';
    
    RETURN IFNULL(v_count, 0);
END $$

-- 2. HÀM TÍNH SỐ TIỀN GIẢM GIÁ (Discount Calculator)
-- Tác dụng: Nhập vào tổng tiền và mã coupon -> Trả về số tiền được giảm
-- Lý do cần: Logic check hạn sử dụng, check giá trị đơn tối thiểu khá dài dòng, tách ra hàm để dùng lại nhiều nơi.
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

    -- Lấy thông tin coupon
    SELECT discount_value, min_order_value, expired_date, quantity, used_count
    INTO v_discount, v_min_order, v_expiry, v_qty, v_used
    FROM coupons 
    WHERE coupon_code = p_code;

    -- Nếu không tìm thấy coupon -> Giảm 0đ
    IF v_discount IS NULL THEN 
        RETURN 0;
    END IF;

    -- Check 1: Hết hạn chưa?
    IF NOW() > v_expiry THEN 
        RETURN 0;
    END IF;

    -- Check 2: Đã hết lượt dùng chưa?
    IF v_used >= v_qty THEN 
        RETURN 0;
    END IF;

    -- Check 3: Đơn hàng có đủ giá trị tối thiểu không?
    IF p_total_order < v_min_order THEN 
        RETURN 0;
    END IF;

    -- Nếu pass hết -> Trả về số tiền giảm
    RETURN v_discount;
END $$

-- 3. HÀM LẤY TRẠNG THÁI HIỂN THỊ CỦA SẢN PHẨM (Text Helper)
-- Tác dụng: Trả về chữ "Còn hàng", "Sắp hết", "Hết hàng" dựa trên số lượng.
-- Lý do cần: Để hiển thị lên giao diện (Frontend) hoặc báo cáo cho đẹp.
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

-- use function example
SELECT 
    pro_name,
    f_get_real_stock(pro_id) AS 'Tồn kho thực tế', -- Gọi hàm 1
    f_get_product_status_label(f_get_real_stock(pro_id)) AS 'Trạng thái' -- Gọi hàm 3 lồng vào hàm 1
FROM products;

-- Giả sử khách mua 200k, nhập mã 'WELCOME20'
SELECT f_calculate_discount_amount(200000, 'WELCOME20') AS 'Tiền được giảm';

-- Giả sử khách mua 50k (không đủ điều kiện tối thiểu 100k của mã WELCOME20)
SELECT f_calculate_discount_amount(50000, 'WELCOME20') AS 'Tiền được giảm';