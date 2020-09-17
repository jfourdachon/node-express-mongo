const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const userRouter = require('./routes/user.route');
const tourRouter = require('./routes/tour.route');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

const app = express();

// 1 - GLOBAL MIDDLEWARES

// Set security http headers
app.use(helmet());

app.use(cors());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});

// Can apply this limiter on specific route -> ()app.user('/users', limiter)
app.use(limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
// Ex: login : {
//       "email" : {$gt: ""},     -> always true
//        password: "real-password"
// }
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameters pollution
app.use(hpp());

// Test middleware
app.use((req, _, next) => {
  req.requesTime = new Date().toISOString();
  next();
});

// - ROUTES

app.use('/users', userRouter);
app.use('/tours', tourRouter);

// 404 - all routes not found in others middlewares
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server!!`));
});

//Operationnal errors middleware
app.use(globalErrorHandler);

module.exports = app;
