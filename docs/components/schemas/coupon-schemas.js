export default {
    CouponCheck: {
      type: 'object',
      properties: {
        originalAmount: { type: 'number' },
        discountAmount: { type: 'number' },
        finalAmount: { type: 'number' },
        status: { type: 'string', example: 'VALID' },
      },
    },
  };