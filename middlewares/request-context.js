import { v4 as uuidv4 } from 'uuid';

export const requestContext = (req, res, next) => {
  // Tạo một mã UUID duy nhất cho mỗi yêu cầu
  req.requestId = uuidv4();
  
  // Gắn vào header để Frontend cũng có thể nhận biết và báo cáo nếu gặp lỗi
  res.setHeader('X-Request-Id', req.requestId);
  
  next();
};