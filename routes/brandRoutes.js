const express = require('express');

const brandController = require('../controllers/brandController');

const router = express.Router();

router
  .route('/')
  .post(brandController.createBrand)
  .get(brandController.getAllBrands);

router
  .route('/:id')
  .get(brandController.getBrand)
  .patch(
    brandController.uploadBrandImage,
    brandController.resizeBrandImage,
    brandController.updateBrand,
  )
  .delete(brandController.deleteBrand);

module.exports = router;
