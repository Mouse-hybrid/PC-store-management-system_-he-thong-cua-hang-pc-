import express from 'express';
import { getMe, getAllUsers, deactivateUser, updateMyProfile, changePassword } from '../controllers/user-c.js';
import { protect } from '../middlewares/auth-mw.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.get('/', protect, getAllUsers);
router.patch('/me', protect, updateMyProfile);
router.patch('/change-password', protect, changePassword);
router.patch('/:id/deactivate', protect, deactivateUser);

export default router;