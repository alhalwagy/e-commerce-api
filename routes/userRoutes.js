const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

router.patch('/updateUserPassword/:id', userController.updateUserPassword);

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
