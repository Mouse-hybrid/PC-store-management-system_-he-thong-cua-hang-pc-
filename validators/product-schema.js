import { z } from 'zod';

export const productSchema = z.object({
  body: z.object({
    pro_sku: z.string().max(50).nonempty('Mã SKU là bắt buộc'),
    pro_name: z.string().min(5, 'Tên sản phẩm quá ngắn'),
    brand_id: z.number().int().positive(),
    category_id: z.number().int().positive(),
    pro_price: z.number().min(0, 'Giá sản phẩm không được âm'),
    pro_quantity: z.number().int().min(0, 'Số lượng tồn kho không được âm'),
    pro_warranty: z.string().max(100).optional(),
    description: z.string().optional()
  })
});

// Giữ nguyên phần productQuerySchema của bạn vì nó đã chuẩn rồi
export const productQuerySchema = z.object({
    query: z.object({
      categoryId: z.string().transform(Number).optional(),
      brandId: z.string().transform(Number).optional(),
      minPrice: z.string().transform(Number).optional(),
      maxPrice: z.string().transform(Number).optional(),
      q: z.string().optional()
    })
  }).partial();