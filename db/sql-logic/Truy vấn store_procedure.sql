-- Đổi dấu kết thúc lệnh mặc định từ (;) sang ($$)
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_get_top_selling_products $$
CREATE PROCEDURE sp_get_top_selling_products(
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_limit INT
)
BEGIN
    SELECT 
        p.pro_id,
        p.pro_name,
        SUM(od.quantity) AS total_sold_quantity,
        SUM(od.total_line_price) AS total_revenue
    FROM orders o
    JOIN order_details od ON o.order_id = od.order_id
    JOIN products p ON od.product_id = p.pro_id
    WHERE o.status = 'COMPLETED' 
      AND DATE(o.created_at) BETWEEN p_start_date AND p_end_date
    GROUP BY 
        p.pro_id, 
        p.pro_name
    ORDER BY 
        total_sold_quantity DESC, 
        total_revenue DESC
    LIMIT p_limit;
END $$

-- Trả lại dấu kết thúc lệnh về mặc định (;)
DELIMITER ;

-- Ví dụ 1: Lấy Top 5 sản phẩm bán chạy nhất trong tháng 10 năm 2025
CALL sp_get_top_selling_products('2025-10-01', '2025-10-31', 5);

-- Ví dụ 2: Lấy Top 10 sản phẩm bán chạy nhất từ đầu năm 2026 đến nay
CALL sp_get_top_selling_products('2026-01-01', '2026-03-25', 10);

-- Ví dụ 3: Chỉ lấy đúng 1 Quán quân (sản phẩm bán chạy nhất mọi thời đại nếu bạn để khoảng thời gian cực rộng)
CALL sp_get_top_selling_products('2000-01-01', '2099-12-31', 1);

-- lệnh xem qua view 
SELECT * FROM v_daily_revenue;

SELECT * FROM v_bill_details 
WHERE order_id = 1;

SELECT * FROM v_daily_revenue 
WHERE MONTH(date) = 3 AND YEAR(date) = 2026
ORDER BY revenue DESC;