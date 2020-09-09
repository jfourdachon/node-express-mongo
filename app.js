const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRouter = require('./routes/user.route');
const tourRouter = require('./routes/tour.route');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

const app = express();

// 1 - MIDDLEWARES

app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

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
