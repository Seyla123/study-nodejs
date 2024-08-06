/* eslint-disable prettier/prettier */
const express = require('express');

const router = express.Router();
const productController = require('../controllers/productController');

router.param('id',productController.checkId);
router
    .route('/')
    .get(productController.allProduct)
    .post(productController.checkBody, productController.createProduct)
router.route('/:id')
    .get(productController.getProduct)
    .patch(productController.editProduct)
    .delete(productController.removeProduct);

module.exports = router;
