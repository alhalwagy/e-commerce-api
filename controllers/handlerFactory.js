const slugify = require('slugify');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //for create in nested route
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

exports.getAll = (Model, searchModelName) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.categoryId) {
      filter = { categoryId: req.params.categoryId };
    }
    const features = new APIFeatures(Model.find(filter), req.query)
      .paginate(await Model.countDocuments())
      .sort()
      .limitFields()
      .filter()
      .search(searchModelName);

    const documents = await features.query;
    res.status(200).json({
      status: 'success',
      result: documents.length,
      data: {
        documents,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = await Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const document = await query;
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
    //FOR UPDATE SLUG WITH UPDATE NAME
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    //FOR UPDATE SLUG WITH UPDATE TITLE
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
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
