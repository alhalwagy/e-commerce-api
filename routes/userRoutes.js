const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(authController.protect);

router.patch(
  '/updateUserPassword/:id',
  authController.protect,
  userController.updateUserPassword,
);
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgetPassword', authController.forgetPassword);
router.post('/verifyResetCode', authController.verifyPassResetCode);
router.put('/resetPassword', authController.resetPassword);

router.get('/getMe', userController.getLoggedUserData, userController.getUser);
router.put('/changeMyPassword', userController.updateLoggedUserPassword);
router.put('/updateMe', userController.updateLoggedUserData);
router.delete('/deleteMe', userController.deleteLoggedUserData);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(
    userController.uploadUserImage,
    userController.resizeUserImage,
    userController.updateUser,
  )
  .delete(userController.deleteUser);

module.exports = router;
