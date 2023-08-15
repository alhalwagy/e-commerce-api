const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/userModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getUser = factory.getOne(User);
exports.getAllUser = factory.getAll(User);

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
exports.uploadUserImage = upload.fields([
  {
    name: 'image',
    maxCount: 1,
  },
]);

//use sharp package to image preprocessing

exports.resizeUserImage = catchAsync(async (req, res, next) => {
  if (!req.files.image) {
    return next();
  }
  req.body.image = `User-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.files.image[0].buffer)
    .resize(700, 700)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/User-images/${req.body.image}`);

  next();
});

exports.updateUserPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('+password');

  if (!user.correctPassword(req.body.currentPassword, user.password)) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
