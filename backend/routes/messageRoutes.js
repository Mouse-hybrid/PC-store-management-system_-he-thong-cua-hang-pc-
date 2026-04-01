const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const messageController = require('../controllers/messageController');

router.get('/:friendId', verifyToken, messageController.getConversation);
router.post('/', verifyToken, messageController.sendMessage);

module.exports = router;