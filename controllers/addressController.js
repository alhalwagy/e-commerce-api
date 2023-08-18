const catchAsync = require('../utils/catchAsync');

const User = require('../models/userModel');


exports.addAddress = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true },
  );

  res.status(200).json({
    status: 'success',
    message: 'Address added successfully.',
    data: user.addresses,
  });
});

exports.removeAddress = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true },
  );

  res.status(200).json({
    status: 'success',
    message: 'Address removed successfully.',
    data: user.addresses,
  });
});


exports.getLoggedUserAddresses = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('addresses');

  res.status(200).json({
    status: 'success',
    results: user.addresses.length,
    data: user.addresses,
  });
});
