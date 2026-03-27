const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.post('/save', authMiddleware.verifyToken, gameController.saveGame);
router.get('/load/:slug', authMiddleware.verifyToken, gameController.loadGame);

module.exports = router;