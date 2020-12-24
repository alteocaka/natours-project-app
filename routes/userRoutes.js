const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const emailController = require('../controllers/emailController');

// We can also use the "authController.protect"
// middleware like this, and not include it
// in each of the reqs below. Because that's how middlewares
// work. Using it this way will affect everything below it.
// ***** router.use(authController.protect) *****

// 1) GET | Get current user that's logged in.
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

// 2) GET | Get user (from ID, only for admins).
router.get(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  userController.getUser
);

// 3) GET | Get all users (Only for admins).
router.get(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  userController.getAllUsers
);

// 4) POST | Sign Up.
router.post('/signup', emailController.sendMail, authController.signup);

// 5) POST | Login.
router.post('/login', authController.login);

// 6) POST | Create a user (Only for admins).
router.post(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  userController.createUser
);

// 7) PATCH | Update password.
router.patch(
  '/update-password',
  authController.protect,
  authController.updatePassword
);

// 8) PATCH | Update user
router.patch(
  '/update-me',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

// 9) PATCH | Update user (Only for admins).
router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  userController.updateUser
);

// 10) DELETE | Delete user (Deactivate his account / status)
// Not actually deleting it from the database.
router.delete('/delete-me', authController.protect, userController.deleteMe);

// 11) DELETE | Delete user from the database (Only for admins).
router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  userController.uploadUserPhoto,
  userController.deleteUser
);

module.exports = router;
