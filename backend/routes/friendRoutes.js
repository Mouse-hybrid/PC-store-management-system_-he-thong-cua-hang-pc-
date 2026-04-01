const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const friendController = require('../controllers/friendController');

router.get('/', verifyToken, friendController.listFriends);
router.get('/requests', verifyToken, friendController.listRequests);
router.post('/request', verifyToken, friendController.sendRequest);
router.put('/request/:id/accept', verifyToken, friendController.acceptRequest);
router.put('/request/:id/reject', verifyToken, friendController.rejectRequest);
router.delete('/:friendId', verifyToken, friendController.unfriend);

module.exports = router;