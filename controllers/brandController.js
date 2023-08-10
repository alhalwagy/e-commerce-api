const Brand = require('../models/brandModel');
const factory = require('./handlerFactory');

exports.createBrand= factory.createOne(Brand);
exports.getAllBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand);
exports.updateBrand = factory.updateOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);
