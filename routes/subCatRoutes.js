const express = require('express');
const subCatController = require('../controllers/subCatController');

const router = express.Router({mergeParams:true});

router
  .route('/')
  .post(subCatController.creatSubCategory)
  .get(subCatController.getAllSubCategories);

router
  .route('/:id')
  .get(subCatController.getSubCategory)
  .delete(subCatController.deleteSubCategory)
  .patch(subCatController.updateSubCategory);

module.exports = router;
