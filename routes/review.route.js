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
router.use(protect);
router.get('/', getAllReviews);
router.get('/:id', getReviewById);
router.post('/', restrictTo('user'), setTourUserIds, createReview);

router.patch('/:id', restrictTo('admin', 'user'), updateReview);
router.delete('/:id', restrictTo('admin', 'user'), deleteReview);

module.exports = router;
