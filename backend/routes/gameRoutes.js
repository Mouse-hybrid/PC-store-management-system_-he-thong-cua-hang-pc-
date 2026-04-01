const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
<<<<<<< HEAD
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/save', verifyToken, gameController.saveGame);
router.get('/load/:slug', verifyToken, gameController.loadGame);

router.get('/:slug/help', verifyToken, gameController.getGameHelp);
router.post('/:slug/score', verifyToken, gameController.submitScore);
router.get('/:slug/reviews', verifyToken, gameController.getReviews);
router.post('/:slug/reviews', verifyToken, gameController.addReview);
=======
const authMiddleware = require('../middleware/authMiddleware'); 

router.post('/save', authMiddleware.verifyToken, gameController.saveGame);
router.get('/load/:slug', authMiddleware.verifyToken, gameController.loadGame);
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4

module.exports = router;