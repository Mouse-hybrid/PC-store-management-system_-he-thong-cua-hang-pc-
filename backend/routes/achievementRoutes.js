const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const achievementController = require('../controllers/achievementController');

router.get('/', verifyToken, achievementController.getMyAchievements);
router.post('/unlock/:slug', verifyToken, achievementController.unlockAchievement);

module.exports = router;