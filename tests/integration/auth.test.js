import request from 'supertest';
import app from '../../app.js';

describe('Auth Workflow', () => {
  it('nên đăng nhập thành công với tài khoản hợp lệ', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken'); // Token để dùng cho các request sau
  });

  it('không nên cho phép truy cập route bảo vệ nếu thiếu Token', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.statusCode).toEqual(401);
  });
});