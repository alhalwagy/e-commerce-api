const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.addProductToWishList = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { wishList: req.body.productId },
    },
    {
      new: true,
    },
  );
  res.status(200).json({
    status: 'success',
    data: user.wishList,
  });
});

exports.removeProductFromWishList = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { wishList: req.body.productId },
    },
    {
      new: true,
    },
  );
  res.status(200).json({
    status: 'success',
    data: user.wishList,
  });
});

exports.getMyWishList = catchAsync(async (req, res, next) => {
  const wishList = await User.findById(req.user.id)
    .select('wishList -_id')
    .populate('wishList');

  res.status(200).json({
    status: 'success',
    data: {
      wishList,
    },
  });
});
