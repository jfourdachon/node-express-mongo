const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRouter = require('./routes/user.route');
const tourRouter = require('./routes/tour.route');

const app = express();

// 1 - MIDDLEWARES

app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// middleware exemple
// app.use((req, res, next) => {
//   console.log('Hello from the middleware!');
//   next();
// });

app.use((req, res, next) => {
  req.requesTime = new Date().toISOString();
  next();
});

// - ROUTES

app.use('/users', userRouter);
app.use('/tours', tourRouter);

module.exports = app;
