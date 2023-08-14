/* eslint-disable import/no-extraneous-dependencies */
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const Category = require('../models/categoryModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createCategory = factory.createOne(Category);
exports.getAllCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);

const multerStorage = multer.memoryStorage();

// Check if user upload only images or not
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400));
  }
};
//give filter and storage to multer
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
//upload image
exports.uploadCategoryImage = upload.fields([
  {
    name: 'image',
    maxCount: 1,
  },
]);

//use sharp package to image preprocessing

exports.resizeCategoryImage = catchAsync(async (req, res, next) => {
  if (!req.files.image) {return next()};
  req.body.image = `Category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.files.image[0].buffer)
    .resize(700, 700)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/category-images/${req.body.image}`);

  next();
});
