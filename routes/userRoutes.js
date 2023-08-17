const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgetpassword', authController.forgetPassword);
router.post('/verifyresetcode', authController.verifyResetCode);
router.post('/resetpassword', authController.resetPassword);

router.use(authController.protect);

router.get('/getme',userController.getUserLoggedData)
router.post('/updatemypassword', userController.updateMyPassword);
router.patch('/updateme', userController.updateMe);
router.patch('/deleteme', userController.deleteMe);

router.patch(
  '/updateUserPassword/:id',
  authController.protect,
  userController.updateUserPassword,
);

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
