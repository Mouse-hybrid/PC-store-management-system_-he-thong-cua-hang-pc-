import express from 'express';
import * as productController from '../controllers/product-c.js';
import { validate } from '../middlewares/validate-mw.js';
import { productQuerySchema } from '../validators/product-schema.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Products
 * description: Quản lý và tra cứu linh kiện máy tính (CPU, GPU, RAM, VGA...)
 */

/**
 * @swagger
 * /products:
 * get:
 * summary: Lấy danh sách linh kiện kèm bộ lọc chuyên sâu
 * tags: [Products]
 * parameters:
 * - in: query
 * name: category
 * schema:
 * type: string
 * description: Lọc theo danh mục sản phẩm (ví dụ: VGA, CPU)
 * - in: query
 * name: brand
 * schema:
 * type: string
 * description: Lọc theo hãng sản xuất (ví dụ: ASUS, MSI, Intel)
 * - in: query
 * name: minPrice
 * schema:
 * type: number
 * description: Khoảng giá thấp nhất
 * - in: query
 * name: maxPrice
 * schema:
 * type: number
 * description: Khoảng giá cao nhất
 * responses:
 * 200:
 * description: Trả về danh sách linh kiện kèm tồn kho thực tế (real_stock)
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Product'
 * 400:
 * description: Lỗi dữ liệu truy vấn không hợp lệ
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error'
 */
router.get('/', validate(productQuerySchema), productController.getAllProducts);

/**
 * @swagger
 * /products/search:
 * get:
 * summary: Tìm kiếm linh kiện theo từ khóa (Tên hoặc Mô tả)
 * tags: [Products]
 * parameters:
 * - in: query
 * name: q
 * required: true
 * schema:
 * type: string
 * description: Từ khóa tìm kiếm linh kiện
 * responses:
 * 200:
 * description: Kết quả tìm kiếm tương ứng
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Product'
 * 400:
 * description: Thiếu từ khóa tìm kiếm
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error'
 */
router.get('/search', productController.searchProducts);

export default router;