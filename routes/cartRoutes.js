const express = require('express');

const router = express.Router();

const cartController = require('../controllers/cartController');

router
  .route('/')
  .get(cartController.getCart)
  .post(cartController.checkProductId, cartController.postCart)
  .delete(cartController.checkProductId, cartController.postCartDeleteProduct);

module.exports = router;
