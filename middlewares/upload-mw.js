import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AppError from '../utils/appError.js';

// Tự động kiểm tra và tạo thư mục nếu chưa tồn tại
const uploadDir = 'public/uploads/products/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất: product-timestamp-random.ext
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `product-${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
  }
});

const fileFilter = (req, file, cb) => {
  // 1. Kiểm tra MimeType
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  
  // 2. Kiểm tra phần mở rộng (Extension)
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) && allowedExts.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new AppError('Định dạng ảnh không hợp lệ! Chỉ chấp nhận .jpg, .png, .webp', 400), false);
  }
};

export const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 2 * 1024 * 1024 // Giới hạn 2MB cho mỗi ảnh linh kiện
  }
});