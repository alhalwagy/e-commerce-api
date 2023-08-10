const slugify = require('slugify');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req.body.categoryId) {
      // eslint-disable-next-line no-unused-expressions
      req.body.categoryId = req.params.categoryId;
    }

    const newDocument = await Model.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        newDocument,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.categoryId) {
      filter = { categoryId: req.params.categoryId };
    }
    const features = new APIFeatures(Model.find(filter), req.query)
      .paginate()
      .sort()
      .limitFields()
      .filter();
    const documents = await features.query;

    res.status(200).json({
      status: 'success',
      result: documents.length,
      data: {
        documents,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findById(req.params.id);

    if (!document) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new AppError('No document found with this ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
