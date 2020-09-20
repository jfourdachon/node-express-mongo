const express = require('express');
const {
  getAllReviews,
  createReview
} = require('../controllers/review.controller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true }); // mergeParams comes from nested tour route ('/tourId/reviews', reviewRouter)

// GET  /tour/dzer77sch7fdfdzpn/reviews
// POST /reviews

router.get('/', getAllReviews);

router.post('/', protect, restrictTo('user'), createReview);

module.exports = router;
