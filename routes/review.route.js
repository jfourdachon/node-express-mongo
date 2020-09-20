const express = require('express');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  getReviewById
} = require('../controllers/review.controller');
const { protect, restrictTo } = require('../middlewares/auth');
const { setTourUserIds } = require('../middlewares/review');

const router = express.Router({ mergeParams: true }); // mergeParams comes from nested tour route ('/tourId/reviews', reviewRouter)

// GET  /tour/dzer77sch7fdfdzpn/reviews
// POST /reviews

router.get('/', getAllReviews);
router.get('/:id', protect, getReviewById);
router.post('/', protect, restrictTo('user'), setTourUserIds, createReview);

router.patch('/:id', protect, updateReview);

router.delete('/:id', protect, restrictTo('admin'), deleteReview);

module.exports = router;
