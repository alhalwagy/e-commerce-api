/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
const mountRoutes = require('./routes');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(mongoSanitize());

app.use(hpp());

app.use(xss());

app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message:
    'Too many Requests created from this IP, please try again after 15 minutes',
});

// Apply the rate limiting middleware to all requests
app.use('/api', limiter);

app.use(
  express.json({
    limit: '10kb',
  }),
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mountRoutes(app);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!!`, 404));
});
app.use(errorController);

module.exports = app;
