import express from 'express';
import * as inventoryController from '../controllers/inventory-c.js';

const router = express.Router();

/**
 * @swagger
 * /inventory/warranty/{serial}:
 * get:
 * summary: Tra cứu thông tin bảo hành qua Serial Number
 * tags: [Inventory]
 * parameters:
 * - in: path
 * name: serial
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Thông tin bảo hành và ngày hết hạn
 */
router.get('/warranty/:serial', inventoryController.checkWarranty);

export default router;