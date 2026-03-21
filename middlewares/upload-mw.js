import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AppError from '../utils/appError.js';

// Tạo thư mục tự động nếu chưa có
const uploadDir = 'public/uploads/products';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình nơi lưu và tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Tên file sẽ có dạng: image-1711234567.jpg
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Bộ lọc: Chặn đứng nếu không phải là file Ảnh
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Chỉ cho phép upload định dạng hình ảnh (JPG, PNG...)!', 400), false);
  }
};

// Khởi tạo Middleware
export const uploadProductImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Tối đa 2MB mỗi ảnh
  fileFilter
}).single('image'); // Chỉ nhận 1 ảnh từ field tên là 'image' trên Form