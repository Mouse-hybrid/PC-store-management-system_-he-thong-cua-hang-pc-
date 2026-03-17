export default {
    User: {
      type: 'object',
      properties: {
        user_id: { type: 'integer' },
        username: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string', enum: ['MEMBER', 'STAFF', 'ADMIN'] },
        full_name: { type: 'string' },
        phone_number: { type: 'string' },
        points: { type: 'integer', description: 'Điểm thưởng tích lũy của khách hàng' },
      },
    },
  };