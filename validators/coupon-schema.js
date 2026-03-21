import { z } from 'zod';

export const couponSchema = z.object({
  body: z.object({
    coupon_code: z.string().min(3).max(50),
    coupon_name: z.string().max(255).optional(),
    discount_value: z.number().positive('Giá trị giảm giá phải lớn hơn 0'),
    min_order_value: z.number().min(0).default(0),
    quantity: z.number().int().positive().default(100),
    expired_date: z.string().refine((date) => new Date(date) > new Date(), {
      message: 'Ngày hết hạn phải lớn hơn ngày hiện tại'
    })
  })
});

// THÊM SCHEMA (Dành riêng cho API Check mã)
export const checkCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Vui lòng nhập mã giảm giá'),
    totalAmount: z.number().min(0, 'Tổng tiền không hợp lệ')
  })
});