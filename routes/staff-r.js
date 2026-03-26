import express from 'express';
import * as staffController from '../controllers/staff-c.js';
import { protect, restrictTo } from '../middlewares/auth-mw.js';

const router = express.Router();

router.use(protect);
router.patch('/salary', restrictTo('ADMIN'), staffController.updateStaffSalary);

export default router;