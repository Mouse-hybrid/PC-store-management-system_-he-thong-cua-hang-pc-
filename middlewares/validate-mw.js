import AppError from '../utils/appError.js';

export const validate = (schema) => async (req, res, next) => {
  try {
    if (!schema) {
      return next(new AppError('Lỗi Server: Chưa cung cấp schema để validate!', 500));
    }
    // Cho phép validate đồng thời body, query và params nếu schema yêu cầu
    const validatedData = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Cập nhật lại dữ liệu đã được parse (để tận dụng transform của Zod)
    req.body = validatedData.body;
    req.query = validatedData.query;
    req.params = validatedData.params;

    next();
  } catch (error) {
    if (error.errors) {
      const detail = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new AppError(`Dữ liệu không hợp lệ: ${detail}`, 400));
    }
    
    // 3. Nếu là lỗi hệ thống khác, ném ra ngoài để bộ xử lý trung tâm lo
    next(error);
  }
};