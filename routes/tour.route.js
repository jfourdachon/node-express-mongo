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
const reviewRouter = require('./review.route');

// Nested routes
// GET  /tour/dzer77sch7fdfdzpn/reviews
// POST  /tour/dzer77sch7fdfdzpn/reviews
router.use('/:tourId/reviews', reviewRouter);

// alias with middleware
router.get('/top-5-cheap', aliasTopTours, getAllTours);

router.get('/', getAllTours);
router.get('/:id', getTourById);

router.get(
  '/monthly-plan/:year',
  protect,
  restrictTo('admin', 'lead-guide', 'guide'),
  getMonthlyPlan
);

router.use(protect, restrictTo('admin', 'lead-guide'));
// aggregation routes
router.get('/stats', getTourStats);

router.post('/register', protect, createTour);
router.patch('/:id', updateTour);
router.delete('/:id', protect, deleteTour);

module.exports = router;
