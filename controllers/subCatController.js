const SubCategory = require('../models/subCategoryModel');
const factory = require('./handlerFactory');

exports.creatSubCategory = factory.createOne(SubCategory);
exports.getSubCategory = factory.getOne(SubCategory);
exports.getAllSubCategories = factory.getAll(SubCategory);
exports.updateSubCategory = factory.updateOne(SubCategory);
exports.deleteSubCategory = factory.deleteOne(SubCategory);
