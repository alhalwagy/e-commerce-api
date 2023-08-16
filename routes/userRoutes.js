const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUser,
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.createUser,
  );

router.patch(
  '/updateUserPassword/:id',
  authController.protect,
  userController.updateUserPassword,
);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getUser,
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.uploadUserImage,
    userController.resizeUserImage,
    userController.updateUser,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser,
  );

module.exports = router;
