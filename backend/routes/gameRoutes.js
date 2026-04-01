const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/save', verifyToken, gameController.saveGame);
router.get('/load/:slug', verifyToken, gameController.loadGame);

router.get('/:slug/help', verifyToken, gameController.getGameHelp);
router.post('/:slug/score', verifyToken, gameController.submitScore);
router.get('/:slug/reviews', verifyToken, gameController.getReviews);
router.post('/:slug/reviews', verifyToken, gameController.addReview);

module.exports = router;