const express = require('express');
const morgan = require('morgan');

const categoryRoutes = require('./routes/categoryRoutes.js');
const errorController = require('./controllers/errorController.js');
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  express.json({
    limit: '10kb',
  })
);

app.use('/api/v1/category', categoryRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!!`, 404));
});
app.use(errorController);

module.exports = app;
