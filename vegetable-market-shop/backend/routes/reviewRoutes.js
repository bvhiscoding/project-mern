const express = require('express');
const {
  createReview,
  getProductReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
// @route   POST /api/reviews/:productId
router.post('/product/:productId', protect, createReview);
// @route   GET /api/reviews/:productId
router.get('/product/:productId', getProductReviews);
module.exports = router;