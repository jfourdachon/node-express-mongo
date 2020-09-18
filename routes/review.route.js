const express = require('express');
const {
  getAllReviews,
  createReview
} = require('../controllers/review.controller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getAllReviews);

router.post('/register', protect, restrictTo('user'), createReview);

module.exports = router;
