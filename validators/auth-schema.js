import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3, 'Username phải từ 3 ký tự trở lên').max(50),
    email: z.string().email('Email không đúng định dạng').max(100),
    password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự trở lên').max(255),
    full_name: z.string().min(2, 'Họ tên không được để trống').max(100),
    phone_number: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại phải từ 10-11 số'),
<<<<<<< HEAD
    address: z.string().optional(),
    role: z.enum(['MEMBER', 'STAFF', 'ADMIN']).optional()
=======
    address: z.string().optional()
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
    })
});

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Vui lòng nhập Username'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu')
  })
});