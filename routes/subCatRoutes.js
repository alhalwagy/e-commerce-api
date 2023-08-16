const express = require('express');
const subCatController = require('../controllers/subCatController');
const authController = require('../controllers/authController');

const router = express.Router({mergeParams:true});

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    subCatController.createSubCategory,
  )
  .get(subCatController.getAllSubCategories);

router
  .route('/:id')
  .get(subCatController.getSubCategory)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    subCatController.deleteSubCategory,
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    subCatController.updateSubCategory,
  );

module.exports = router;
