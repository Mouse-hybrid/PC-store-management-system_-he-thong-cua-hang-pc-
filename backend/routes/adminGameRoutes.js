const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const adminGameController = require('../controllers/adminGameController');

router.get('/', verifyToken, isAdmin, adminGameController.getAllGames);
router.put('/:id', verifyToken, isAdmin, adminGameController.updateGame);

module.exports = router;