const express = require('express');

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

router.get('/', getAllTours);
router.get('/:id', getTourById);

router.post('/register', createTour);

router.patch('/:id', updateTour);

router.delete('/:id', deleteTour);

module.exports = router;
