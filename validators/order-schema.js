import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    guest_name: z.string().min(2, 'Tên khách hàng là bắt buộc').max(100),
    guest_phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
    shipping_address: z.string().min(5, 'Địa chỉ giao hàng quá ngắn'),
    product_id: z.number().int().positive('ID sản phẩm không hợp lệ'),
    quantity: z.number().int().positive('Số lượng mua phải ít nhất là 1'),
    coupon_code: z.string().max(50).optional()
  })
});