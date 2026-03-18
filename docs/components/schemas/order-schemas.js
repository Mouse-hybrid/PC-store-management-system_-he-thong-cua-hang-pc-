export default {
    OrderInput: {
      type: 'object',
      required: ['guest_name', 'guest_phone', 'product_id', 'quantity'],
      properties: {
        guest_name: { type: 'string', example: 'Nguyen Van A' },
        guest_phone: { type: 'string', example: '0987654321' },
        shipping_address: { type: 'string' },
        product_id: { type: 'integer', example: 101 },
        quantity: { type: 'integer', example: 1 },
        coupon_code: { type: 'string', example: 'GIAM10' }
      },
    },
    OrderResponse: {
      type: 'object',
      properties: {
        order_id: { type: 'integer' },
        total_amount: { type: 'number' },
        status: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' }
      }
    }
  };