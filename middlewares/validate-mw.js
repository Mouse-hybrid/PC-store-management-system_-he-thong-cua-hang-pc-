import AppError from '../utils/appError.js';

export const validate = (schema) => async (req, res, next) => {
  try {
    if (!schema) {
      return next(new AppError('Lỗi Server: Chưa cung cấp schema để validate!', 500));
    }
<<<<<<< HEAD

=======
    // Cho phép validate đồng thời body, query và params nếu schema yêu cầu
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
    const validatedData = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

<<<<<<< HEAD
    // 1. Cập nhật body bình thường (Express cho phép ghi đè body thoải mái)
    if (validatedData.body) req.body = validatedData.body;
    
    // 2. Dùng kỹ thuật Object.assign để "rót" dữ liệu vào query và params một cách an toàn
    if (validatedData.query) {
      Object.keys(req.query).forEach(key => delete req.query[key]); 
      Object.assign(req.query, validatedData.query); 
    }
    
    if (validatedData.params) {
      Object.keys(req.params).forEach(key => delete req.params[key]);
      Object.assign(req.params, validatedData.params);
    }
=======
    // Cập nhật lại dữ liệu đã được parse (để tận dụng transform của Zod)
    req.body = validatedData.body;
    req.query = validatedData.query;
    req.params = validatedData.params;
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21

    next();
  } catch (error) {
    if (error.errors) {
      const detail = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new AppError(`Dữ liệu không hợp lệ: ${detail}`, 400));
    }
    
<<<<<<< HEAD
=======
    // 3. Nếu là lỗi hệ thống khác, ném ra ngoài để bộ xử lý trung tâm lo
>>>>>>> f42558b2c199dd3e958fcd5af79d3c8e84e58a21
    next(error);
  }
};