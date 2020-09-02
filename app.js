const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRouter = require('./routes/user.route');

const app = express();

// 1 - MIDDLEWARES

app.use(cors());

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

app.use('/user', userRouter);

module.exports = app;
