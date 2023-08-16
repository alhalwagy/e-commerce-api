const express = require('express');

const brandController = require('../controllers/brandController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    brandController.createBrand,
  )
  .get(brandController.getAllBrands);

router
  .route('/:id')
  .get(brandController.getBrand)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    brandController.uploadBrandImage,
    brandController.resizeBrandImage,
    brandController.updateBrand,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    brandController.deleteBrand,
  );

module.exports = router;
