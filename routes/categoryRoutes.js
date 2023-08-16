const express = require('express');

const categoryController = require('../controllers/categoryController');
const subCatRoutes = require('./subCatRoutes');
const authController = require('../controllers/authController');

const router = express.Router();

router.use('/:categoryId/subcategories', subCatRoutes);

router
  .route('/')
  .post(authController.protect, categoryController.createCategory)
  .get(categoryController.getAllCategories);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(
    categoryController.uploadCategoryImage,
    categoryController.resizeCategoryImage,

    categoryController.updateCategory,
  )
  .delete(categoryController.deleteCategory);

module.exports = router;
