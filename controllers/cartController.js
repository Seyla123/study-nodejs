const { where } = require('sequelize');
const Product = require('../models/product');
const CardItem = require('../models/cart-item');

exports.getCart = async (req, res) => {
  const cart = await req.requestUser.getCart();
  const product = await cart.getProducts();
  console.log('user req :', req.requestUser);
  res.status(200).json({
    status: 'success',
    request: req.requestTime,
    result: product.length,
    data: {
      product: product,
      cart: cart,
    },
  });
};

exports.postCart = async (req, res) => {
  const prodId = req.body.productId;
  const fetchedCart = await req.requestUser.getCart();
  //const product = await fetchedCart.getProducts({ where: { id: prodId } });
  let existingProducts = await fetchedCart.getProducts({ where: { id: prodId } });
  //check if product is already in cart
  let newQuantity = 1;
  if (existingProducts.length > 0) {
    existingProducts = existingProducts[0];
    const oldQuantity = existingProducts.cartItem.quantity;
    newQuantity = oldQuantity + 1;
    await existingProducts.cartItem.update({ quantity: newQuantity });	
  }
  else{
    const product = await Product.findByPk(prodId);
    await fetchedCart.addProduct(product, {
      through: {
        quantity: newQuantity,
      },
    });
  }
  // add product to cart
  // response with cart
  res.status(200).json({
    status: 'success',
    request: req.requestTime,
    data: {
      cart: fetchedCart,
      product:await fetchedCart.getProducts(),
    },
  });
};
exports.postCartDeleteProduct = async (req, res) => {
  const prodId = req.body.productId;
  const fetchedCart = await req.requestUser.getCart();
  const product = await fetchedCart.getProducts({ where: { id: prodId } });
  res.status(200).json({
    status: 'success',
    request: req.requestTime,
    data: {
      cart: product[0],
    },
  });
};
exports.checkProductId = async (req, res, next) => {
  const id = req.body.productId;
  const product = await Product.findByPk(id);
  console.log('product :', product);
  if (!product) {
    return res.status(404).json({
      status: 'fail',
      message: `Invalid ID : ${id}`,
    });
  }
  next();
};
