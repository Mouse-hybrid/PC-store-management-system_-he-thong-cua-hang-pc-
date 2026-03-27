# 🎮 LED MATRIX GAMES - CARO WEB PROJECT

Đây là đồ án môn học Web - Xây dựng hệ thống chơi game Caro trực tuyến tích hợp các tính năng hiện đại như Dark/Light Mode, Xác thực JWT, và Lưu/Tải trạng thái game thời gian thực.

## 🌟 TÍNH NĂNG NỔI BẬT (FEATURES)
1. **Giao diện (UI/UX):** - Hỗ trợ Dark Mode / Light Mode.
   - Hoàn toàn Responsive trên thiết bị di động.
   - Bắt lỗi giao diện thông minh (Trang 404, 403, 500).
2. **Tính năng Game:** Chơi Caro (5 quân liên tiếp), Lưu Game (Save) và Tải ván cũ (Load).
3. **Bảo mật & Hệ thống:**
   - Đăng ký / Đăng nhập sử dụng mã hóa Bcrypt và JWT Token.
   - Giao tiếp bảo mật qua giao thức HTTPS.
   - Trang Quản trị viên (Admin Dashboard) phân quyền độc lập.
4. **Database & API:** - Quản lý Database bằng Knex Migrations & Seeds.
   - Document API tự động tạo bằng Swagger.

## 🛠️ CÔNG NGHỆ SỬ DỤNG
- **Frontend:** React.js (Vite), React Router, Axios, CSS thuần.
- **Backend:** Node.js, Express.js, JWT, Bcrypt.
- **Database:** PostgreSQL (hoặc MySQL) quản lý qua Knex.js.

## 🚀 HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN

### 1. Cài đặt Backend
Di chuyển vào thư mục backend và cài đặt thư viện:
\`\`\`bash
cd backend
npm install
\`\`\`
Thiết lập Database (Tạo các bảng và nạp dữ liệu mẫu):
\`\`\`bash
npx knex migrate:latest
npx knex seed:run
\`\`\`
Khởi động Server Backend (Chạy ở cổng https://localhost:3636):
\`\`\`bash
npm run dev
\`\`\`

### 2. Cài đặt Frontend
Mở một Terminal mới, di chuyển vào thư mục frontend:
\`\`\`bash
cd frontend
npm install
\`\`\`
Khởi động giao diện Web (Chạy ở cổng http://localhost:5173):
\`\`\`bash
npm run dev
\`\`\`

## 🔑 TÀI KHOẢN TEST MẪU (Dữ liệu Seed)
- **Tài khoản Admin:** `admin@boardgame.com` / Mật khẩu: `123456`
- **Tài khoản Người chơi:** `player1@gmail.com` / Mật khẩu: `123456`

## 📚 TÀI LIỆU API (SWAGGER)
Sau khi bật Backend, truy cập: `https://localhost:3636/api-docs`
