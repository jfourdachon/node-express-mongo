const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
} = require('../controllers/tour.controller');
const { createReview } = require('../controllers/review.controller');

// alias with middleware
router.get('/top-5-cheap', aliasTopTours, getAllTours);

// aggregation routes
router.get('/stats', getTourStats);
router.get('/monthly-plan/:year', getMonthlyPlan);

router.get('/', protect, getAllTours);
router.get('/:id', getTourById);

router.post('/register', createTour);

router.patch('/:id', updateTour);

router.delete('/:id', protect, restrictTo('admin', 'lead-guide'), deleteTour);

// Nested routes
// GET  /tour/dzer77sch7fdfdzpn/reviews
// POST  /tour/dzer77sch7fdfdzpn/reviews
// GET  /tour/dzer77sch7fdfdzpn/reviews/smrc740ki8g

router.post('/:tourId/reviews', protect, restrictTo('user'), createReview);

module.exports = router;
