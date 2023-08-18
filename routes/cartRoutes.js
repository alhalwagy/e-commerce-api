const express = require('express');

const cartController = require('../controllers/cartController')
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .post(cartController.addProductToCart)
  .get(cartController.getLoggedUserCart)
  .delete(cartController.clearCart);

router.patch('/applyCoupon', cartController.applyCoupon);

router
  .route('/:itemId')
  .patch(cartController.updateCartItemQuantity)
  .delete(cartController.removeSpecificCartItem);

module.exports = router;
