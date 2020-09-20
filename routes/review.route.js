const express = require('express');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview
} = require('../controllers/review.controller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true }); // mergeParams comes from nested tour route ('/tourId/reviews', reviewRouter)

// GET  /tour/dzer77sch7fdfdzpn/reviews
// POST /reviews

router.get('/', getAllReviews);

router.post('/', protect, restrictTo('user'), createReview);

router.patch('/:id', protect, updateReview);

router.delete('/:id', protect, restrictTo('admin'), deleteReview);

module.exports = router;
