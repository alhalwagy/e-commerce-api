const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/userModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

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

exports.getUserLoggedData = catchAsync(async (req, res, next) => {
  const userData = await User.findById(req.user.id);
  if (!userData) {
    return next(new AppError('User not found. Please log in again.'));
  }
  res.status(200).json({
    status: 'success',
    data: {
      userData,
    },
  });
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const userData = await User.findById(req.user.id);
  if (!userData) {
    return next(new AppError('User not found. Please log in again.'));
  }
  if (!userData.correctPassword(req.body.currentPassword, req.user.password)) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  userData.password = req.body.password;
  userData.passwordConfirm = req.body.passwordConfirm;
  await userData.save();
  res.status(200).json({
    status: 'success',
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  //2)Filtered out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email', 'phone');
  if (req.file) filteredBody.image = req.file.filename;

  //3)Update the user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});


