import request from 'supertest';
import app from '../../app.js';

describe('GET /api/v1/products', () => {
  it('nên trả về danh sách sản phẩm với mã 200', async () => {
    const res = await request(app).get('/api/v1/products');
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    // Kiểm tra xem có trường real_stock từ SQL Function không
    expect(res.body.data[0]).toHaveProperty('real_stock');
  });

  it('nên lọc được sản phẩm theo hãng (brand)', async () => {
    const res = await request(app)
      .get('/api/v1/products')
      .query({ brand: 'ASUS' });
    
    expect(res.statusCode).toEqual(200);
    // Đảm bảo tất cả kết quả đều thuộc hãng ASUS
    res.body.data.forEach(item => {
      expect(item.brand_name).toBe('ASUS');
    });
  });
});