/* eslint-disable import/no-extraneous-dependencies */
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const Brand = require('../models/brandModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createBrand = factory.createOne(Brand);
exports.getAllBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand);
exports.updateBrand = factory.updateOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400));
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadBrandImage = upload.fields([
  {
    name: 'image',
    maxCount: 1,
  },
]);

exports.resizeBrandImage = catchAsync(async (req, res, next) => {
  if (!req.files.image) {
    return next();
  }
  req.body.image = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.files.image[0].buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/brand-images/${req.body.image}`);

  next();
});
