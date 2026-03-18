export default {
    Product: {
      type: 'object',
      properties: {
        pro_id: { type: 'integer' },
        pro_name: { type: 'string' },
        pro_price: { type: 'number' },
        real_stock: { type: 'integer', description: 'Số lượng thực tế từ f_get_real_stock' },
        brand_name: { type: 'string' },
        category_name: { type: 'string' },
      },
    },
  };