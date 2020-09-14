const express = require('express');
const { protect, restrictTo } = require('../controllers/auth.controller');

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

module.exports = router;
