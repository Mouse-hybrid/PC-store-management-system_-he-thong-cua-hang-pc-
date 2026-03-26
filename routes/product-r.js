import express from 'express';
import * as productController from '../controllers/product-c.js';
import { validate } from '../middlewares/validate-mw.js';
import { protect, restrictTo } from '../middlewares/auth-mw.js';
import { productQuerySchema } from '../validators/product-schema.js';
import { uploadProductImage } from '../middlewares/upload-mw.js';

const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lấy danh sách linh kiện kèm bộ lọc
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về danh sách linh kiện
 */
router.get('/', validate(productQuerySchema), productController.getProducts);

/**
 * @swagger
 * /products/{id}:
 * put:
 * summary: Cập nhật thông tin cơ bản sản phẩm (Staff/Admin)
 * tags: [Products]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Cập nhật thành công
 */
router.put('/:id', protect, restrictTo('STAFF', 'ADMIN'), productController.updateProduct);

/**
 * @swagger
 * /products/{id}/restock:
 * post:
 * summary: Nhập thêm số lượng cho 1 sản phẩm (Staff/Admin)
 * tags: [Products]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Nhập kho thành công
 */
router.post('/:id/restock', protect, restrictTo('STAFF', 'ADMIN'), productController.restockProduct);

/**
 * @swagger
 * /products/import:
 * post:
 * summary: Nhập kho số lượng lớn (Staff/Admin)
 * tags: [Products]
 * security:
 * - bearerAuth: []
 * responses:
 * 201:
 * description: Nhập kho thành công
 */
router.post('/import', protect, restrictTo('STAFF', 'ADMIN'), productController.importProduct);

/**
 * @swagger
 * /products/{id}/images:
 * post:
 * summary: Upload ảnh cho sản phẩm (Staff/Admin)
 * tags: [Products]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Upload thành công
 */
router.post('/:id/images', protect, restrictTo('STAFF', 'ADMIN'), uploadProductImage, productController.uploadImage);

/**
 * @swagger
 * /products/catalog/categories:
 * get:
 * summary: Lấy danh sách tất cả danh mục
 * tags: [Products]
 * responses:
 * 200:
 * description: Thành công
 */
router.get('/catalog/categories', productController.getAllCategories);
router.post('/catalog/categories', protect, restrictTo('STAFF', 'ADMIN'), productController.createCategory); // DÒNG MỚI THÊM
router.put('/catalog/categories/:id', protect, restrictTo('STAFF', 'ADMIN'), productController.updateCategory);
/**
 * @swagger
 * /products/catalog/brands:
 * get:
 * summary: Lấy danh sách tất cả nhãn hàng
 * tags: [Products]
 * responses:
 * 200:
 * description: Thành công
 */
router.get('/catalog/brands', productController.getAllBrands);
router.post('/catalog/brands', protect, restrictTo('STAFF', 'ADMIN'), productController.createBrand); // DÒNG MỚI THÊM
router.put('/catalog/brands/:id', protect, restrictTo('STAFF', 'ADMIN'), productController.updateBrand);

router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /products/{id}:
 * delete:
 * summary: Xóa sản phẩm (Chỉ Admin)
 * tags: [Products]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 204:
 * description: Xóa thành công
 */
router.delete('/:id', protect, restrictTo('ADMIN'), productController.deleteProduct);

export default router;