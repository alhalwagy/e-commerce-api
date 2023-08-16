const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

router.patch('/updateUserPassword/:id', userController.updateUserPassword);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
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
