const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1 - MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

//render static file  like -> 127.0.0.1/overview.html
app.use(express.static(`${__dirname}/public`));

// middleware exemple
app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});

app.use((req, res, next) => {
  req.requesTime = new Date().toISOString();
  next();
});

// - ROUTES

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

module.exports = app;
