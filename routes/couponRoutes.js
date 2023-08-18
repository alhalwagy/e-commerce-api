const express = require('express');

const couponController = require('../controllers/couponController');

const authController = require('../controllers/authController');

const router = express.Router();

router.use(
  authController.protect,
  authController.restrictTo('admin', 'manager'),
);

router
  .route('/')
  .get(couponController.getCoupons)
  .post(couponController.createCoupon);
router
  .route('/:id')
  .get(couponController.getCoupon)
  .patch(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

module.exports = router;
