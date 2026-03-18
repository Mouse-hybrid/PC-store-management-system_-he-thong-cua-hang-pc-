import { formatVND } from '../../utils/formatter.js';

describe('Định dạng tiền tệ VNĐ', () => {
  it('nên định dạng số thành chuỗi tiền tệ có dấu phân cách', () => {
    expect(formatVND(1500000)).toBe('1.500.000 VNĐ');
    expect(formatVND(50000)).toBe('50.000 VNĐ');
  });

  it('nên xử lý được giá trị bằng 0', () => {
    expect(formatVND(0)).toBe('0 VNĐ');
  });
});