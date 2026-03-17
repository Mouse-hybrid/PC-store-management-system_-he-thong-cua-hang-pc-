/* ==========================================================================
   FILE: DB pc_store.sql
   MÔ TẢ: Cấu trúc Database bao gồm bảng product_items để quản lý Serial/IMEI
   ========================================================================== */

DROP DATABASE IF EXISTS pc_store;
CREATE DATABASE pc_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pc_store;

-- 1. BẢNG Users & Phân quyền
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('MEMBER', 'STAFF', 'ADMIN') DEFAULT 'MEMBER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    user_id INT PRIMARY KEY,
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    address TEXT,
    loyalty_points INT DEFAULT 0,
    CONSTRAINT fk_customers_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE staff (
    user_id INT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    hire_date DATE,
    salary DECIMAL(15, 2),
    CONSTRAINT fk_staff_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 2. BẢNG Sản phẩm & Kho hàng
CREATE TABLE brands (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE products (
    pro_id INT AUTO_INCREMENT PRIMARY KEY,
    pro_sku VARCHAR(50) UNIQUE,
    pro_name TEXT NOT NULL,
    brand_id INT,
    category_id INT,
    pro_price DECIMAL(15, 2) NOT NULL DEFAULT 0,
    -- pro_quantity: Tổng số lượng tồn (Sync với bảng items)
    pro_quantity INT NOT NULL DEFAULT 0 CHECK (pro_quantity >= 0),
    pro_warranty VARCHAR(100),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_brands FOREIGN KEY (brand_id) REFERENCES brands(brand_id) ON DELETE SET NULL,
    CONSTRAINT fk_products_categories FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

-- [QUAN TRỌNG] Bảng Items: Quản lý từng món hàng cụ thể (Serial/IMEI)
CREATE TABLE product_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    serial_number VARCHAR(100) UNIQUE, -- Mã định danh duy nhất (Barcode/IMEI)
    status ENUM('AVAILABLE', 'SOLD', 'DEFECTIVE', 'WARRANTY', 'RETURNED') DEFAULT 'AVAILABLE',
    order_id INT DEFAULT NULL,   -- Link tới đơn hàng khi đã bán
    import_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    sold_date DATETIME DEFAULT NULL,
    CONSTRAINT fk_items_products FOREIGN KEY (product_id) REFERENCES products(pro_id) ON DELETE CASCADE
    -- FK order_id sẽ được thêm sau khi tạo bảng orders
);

-- 3. BẢNG Đơn hàng & Thanh toán
CREATE TABLE coupons (
    coupon_code VARCHAR(50) PRIMARY KEY,
    coupon_name VARCHAR(255),
    discount_value DECIMAL(15, 2) NOT NULL,
    min_order_value DECIMAL(15, 2) DEFAULT 0,
    quantity INT DEFAULT 100,
    used_count INT DEFAULT 0,
    expired_date DATETIME
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    guest_name VARCHAR(100) NOT NULL,
    guest_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    note TEXT,
    total_amount DECIMAL(15, 2) NOT NULL,
    coupon_code VARCHAR(50),
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    final_amount DECIMAL(15, 2) NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    CONSTRAINT fk_orders_coupons FOREIGN KEY (coupon_code) REFERENCES coupons(coupon_code)
);

-- Cập nhật khóa ngoại cho bảng Items (Liên kết vòng)
ALTER TABLE product_items 
ADD CONSTRAINT fk_items_orders FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL;

CREATE TABLE order_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT,
    price_at_purchase DECIMAL(15, 2) NOT NULL,
    product_name_at_purchase TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_line_price DECIMAL(15, 2) GENERATED ALWAYS AS (price_at_purchase * quantity) STORED,
    CONSTRAINT fk_details_orders FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_details_products FOREIGN KEY (product_id) REFERENCES products(pro_id) ON DELETE SET NULL
);

CREATE TABLE payment_methods (
    method_id INT AUTO_INCREMENT PRIMARY KEY,
    method_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    method_id INT,
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('WAITING', 'SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'WAITING',
    transaction_code VARCHAR(100),
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_orders FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_methods FOREIGN KEY (method_id) REFERENCES payment_methods(method_id)
);

-- 4. Logs & Index
CREATE TABLE system_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(50),
    message TEXT,
    related_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Fulltext Search
CREATE FULLTEXT INDEX idx_products_fulltext ON products(pro_name, description);
-- Index Serial để bắn súng barcode nhanh
CREATE INDEX idx_items_serial ON product_items(serial_number);