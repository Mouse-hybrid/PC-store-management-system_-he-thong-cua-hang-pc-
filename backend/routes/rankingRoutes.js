const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const rankingController = require('../controllers/rankingController');

router.get('/:slug', verifyToken, rankingController.getRankingByGame);

module.exports = router;