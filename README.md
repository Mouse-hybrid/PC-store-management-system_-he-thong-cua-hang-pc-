## 🚀 Hướng dẫn cài đặt và chạy dự án (Local Development)

Dự án này sử dụng môi trường HTTPS cho Local và Docker cho Database. Sau khi Clone code về, vui lòng thực hiện đúng các bước sau:

**1. Cài đặt thư viện (Dependencies)**
Mở Terminal tại thư mục gốc của dự án và chạy:
```bash
npm install

2. Thiết lập biến môi trường (.env)
Vì lý do bảo mật, file .env không được đẩy lên Git. Bạn cần tự tạo file này bằng cách copy từ file mẫu:

Cú pháp copy nhanh (Linux/Mac/Git Bash): cp .env.example .env

Hoặc tạo file .env mới và copy toàn bộ nội dung từ .env.example sang.

3. Khởi tạo chứng chỉ SSL (Bắt buộc cho HTTPS)
Dự án chạy trên https://localhost:3443, nên bạn cần tạo thư mục certs và tự sinh chứng chỉ ảo.
Mở Git Bash (hoặc Terminal) ở thư mục gốc và chạy 2 lệnh sau:

Bash
mkdir certs
openssl req -x509 -newkey rsa:2048 -keyout certs/localhost-key.pem -out certs/localhost-cert.pem -days 365 -nodes -subj "/CN=localhost"
4. Khởi động Database bằng Docker
Đảm bảo bạn đã cài và bật ứng dụng Docker Desktop. Chạy lệnh sau để khởi tạo MySQL DB:

Bash
docker-compose up -d
5. Chạy Server
Cuối cùng, khởi động server backend của bạn:

Bash
npm run dev
Server sẽ hiển thị thông báo chạy thành công tại: https://localhost:3443


---

**💡 Mẹo nhỏ cho team của bạn:**
Ở bước 3 tạo chứng chỉ `certs`, dòng lệnh `openssl` là cách nhanh nhất và xịn nhất vì Git Bash (trên Windows) hoặc Terminal (Mac/Linux) đều cài sẵn công cụ này. Đảm bảo chạy xong lệnh đó là file `localhost-key.pem` và `localhost-cert.pem` sẽ tự động nằm gọn gàng trong thư mục `certs` như file `.env` của bạn cấu hình.

Bạn có muốn mình kiểm tra qua file `package.json` để xem lệnh chạy `npm run dev` đã