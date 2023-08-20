const express = require('express');

const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.use(authController.protect);

router.get('/create-checkout-session/:cartId', orderController.checkOutSession);

router
  .route('/')
  .get(orderController.GetAllOrderForLoggedUser, orderController.getAllOrders);

router
  .route('/:cartId')
  .post(authController.restrictTo('user'), orderController.createCashOrder);

router
  .route('/:id')
  .get(authController.restrictTo('user'), orderController.getOrder);

router
  .route('/:id/pay')
  .patch(authController.restrictTo('admin'), orderController.UpdateOrderToPaid);

router
  .route('/:id/deliver')
  .patch(
    authController.restrictTo('admin'),
    orderController.UpdateOrderToDelivered,
  );

module.exports = router;
