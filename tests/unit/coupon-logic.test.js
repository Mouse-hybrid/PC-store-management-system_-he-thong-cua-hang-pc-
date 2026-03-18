// Giả sử bạn có một helper function xử lý logic này ở tầng Service
import { calculateDiscount } from '../../services/coupon-service.js';

describe('Logic tính toán Coupon', () => {
  it('nên giảm giá theo phần trăm (%) chính xác', () => {
    const totalAmount = 1000000; // 1 triệu VNĐ
    const coupon = { type: 'PERCENTAGE', value: 10 }; // Giảm 10%
    
    const result = calculateDiscount(totalAmount, coupon);
    expect(result).toBe(100000); // Phải giảm 100k
  });

  it('không nên giảm quá số tiền tối đa (Max Discount)', () => {
    const totalAmount = 10000000; // 10 triệu VNĐ
    const coupon = { type: 'PERCENTAGE', value: 10, max_discount: 500000 };
    
    const result = calculateDiscount(totalAmount, coupon);
    expect(result).toBe(500000); // Chỉ được giảm tối đa 500k dù 10% là 1 triệu
  });

  it('nên trả về 0 nếu coupon đã hết hạn', () => {
    const totalAmount = 1000000;
    const coupon = { type: 'FIXED', value: 200000, expiry_date: '2020-01-01' };
    
    const result = calculateDiscount(totalAmount, coupon);
    expect(result).toBe(0);
  });
});