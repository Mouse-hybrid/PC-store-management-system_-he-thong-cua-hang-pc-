import { z } from 'zod';

export const paymentSchema = z.object({
  body: z.object({
    order_id: z.number().int().positive(),
    method_id: z.number().int().positive(),
    amount: z.number().positive(),
    status: z.enum(['WAITING', 'SUCCESS', 'FAILED', 'REFUNDED']).default('WAITING'),
    transaction_code: z.string().max(100).optional()
  })
});