const factory = require('./handlerFactory');
const Product = require('../models/productModel');

exports.getAllProduct = factory.getAll(Product, 'Product');
exports.createProduct = factory.createOne(Product);
exports.getProduct = factory.getOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
