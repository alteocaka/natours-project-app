const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// Middleware to parse JSON:
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection:
app.use(mongoSanitize());

// Data sanitization against XSS:
app.use(xss());

// Set security HTTP headers:
app.use(helmet());

// Morgan middleware:
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiter middleware:
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests, please try again in one hour!',
});

app.use('/api', limiter);

// Prevent parameter pollution:
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Express middleware for serving static files:
app.use(express.static(`${__dirname}/public`));

// Our own middleware functions:
// We use app.use() to add another
// middleware to the middleware stack

// app.use((req, res, next) => {
//   console.log('Hello from the middleware!');
//   next();
// });

app.use((req, res, next) => {
  // Here we use this middleware to add a
  // "requestTime" property to the req.
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES//

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// The below code works only because
// it is located in the end, after all
// the other middlewares are already loaded!
app.all('*', (req, res, next) => {
  // res.status(404).send({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl}!`,
  // });

  next(new AppError(`Can't find ${req.originalUrl}!`, 404));
});

// By specifying the 4 arguments below, Express
// recognises its an error handling middleware.
app.use(globalErrorController);

module.exports = app;
