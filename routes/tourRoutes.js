const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

// Redirect urls that start with: '/:tourId/reviews'
// to the review router to process review reqs.
router.use('/:tourId/reviews', reviewRouter);

// 1) GET | Get all tours.
router.get('/', tourController.getAllTours);

// 2) GET | Get one tour.
// N.q.s e bej comment kete poshte punon.
router.get('/:id', tourController.getTour);

// 3) GET | Get top 5 cheap tours.
router.get(
  '/top-5-cheap',
  tourController.aliasTopTours,
  tourController.getAllTours
);

// 4) GET | Get tours within.
router.get('/tours-within/:distance/center/:latlng/unit/:unit', tourController.getToursWithin);

// 5) GET | Get tours distance from a certain point.
router.get('/distances/:latlng/unit/:unit', tourController.getDistances);

// 6) GET | Get tour statistics.
router.get('/tour-stats', tourController.getTourStats);

// 7) GET | Get monthly plan.
router.get(
  '/monthly-plan/:year',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide', 'guide'),
  tourController.getMonthlyPlan
);

// 8) POST | Create a tour.
router.post(
  '/',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.createTour
);

// 9) PATCH | Update a tour.
router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.uploadTourImages,
  tourController.resizeTourImages,
  tourController.updateTour
);

// 10) DELETE | Delete a tour.
router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.deleteTour
);

module.exports = router;
