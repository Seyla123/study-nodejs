const express = require('express');
const morgan = require('morgan');
const User = require('./models/user');

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const AppError = require('./utils/appError');
const GlobalHandleError = require('./controllers/errorController');

const tourRoute = require('./routes/tourRoutes');
const userRoute = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use(express.json());
app.use(express.static(`${__dirname}/4-natours/starter/public`));

app.use(async (req, res, next) => {
  try {
    const user = await User.findByPk(1);
    req.requestUser = await user;
    next();
  } catch (error) {
    console.log(error);
  }
});
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tour', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/order', orderRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(GlobalHandleError);

module.exports = app;
