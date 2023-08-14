const path = require('path');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const categoryRoutes = require('./routes/categoryRoutes');
const errorController = require('./controllers/errorController');
const subCatRoutes = require('./routes/subCatRoutes');
const brandRoutes = require('./routes/brandRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  express.json({
    limit: '10kb',
  }),
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/subcategory', subCatRoutes);
app.use('/api/v1/brand', brandRoutes);
app.use('/api/v1/product', productRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!!`, 404));
});
app.use(errorController);

module.exports = app;
