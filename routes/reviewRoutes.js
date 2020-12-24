const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// The 'mergeParams' property allows us to preserve
// all the req.params from the parent router.
// Extremly useful in our case, since we need
// the tour's id-s in the review routes below.
const router = express.Router({ mergeParams: true });

// Everything below this line of code
// will be effected by this middleware.
// Basically we are protecting every route.
router.use(authController.protect);

// 1) GET | Get all reviews.
router.get('/', reviewController.getAllReviews);

// 2) POST | Create a review.
router.post(
  '/',
  authController.restrictTo('user'),
  reviewController.setTourAndUserIds,
  reviewController.createReview
);

// 3) DELETE | Delete a review.
router.delete(
  '/:id',
  authController.restrictTo('user', 'admin'),
  reviewController.deleteReview
);

// 4) PATCH | Update a review.
router.patch(
  '/:id',
  authController.restrictTo('user', 'admin'),
  reviewController.updateReview
);

module.exports = router;
