exports.getOrder = async (req, res) => {
  try {
    const order = await req.requestUser.getOrders({include : ['products']});
    res.status(200).json({
      status: 'success',
      request: req.requestTime,
      result: order.length,
      data: {
        order,
      },
    });
  } catch (error) {
    console.log('error : ', error);
  }
};
exports.postOrder = async (req, res) => {
  try {
    const fetchedCart = await req.requestUser.getCart();
    const fetchedProduct = await fetchedCart.getProducts();

    const order = await req.requestUser.createOrder();
    const productToAdd = fetchedProduct.map((product) => {
      product.orderItem = { quantity: product.cartItem.quantity };
      return product;
    });
    await order.addProducts(productToAdd);
    res.status(200).json({
      status: 'success',
      request: req.requestTime,
      data: {
        order: order,
      },
    });
  } catch (error) {
    console.log('order error : ', error);
  }
};

exports.checkBody = async (req, res, next) => {
  // Fetch the user's cart
  const fetchedCart = await req.requestUser.getCart();
  if (!fetchedCart) {
    return res.status(404).json({
      status: 'fail',
      message: 'Cart not found for the user.',
    });
  }

  // Fetch products from the user's cart
  const fetchedProducts = await fetchedCart.getProducts();
  if (fetchedProducts.length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Cart is empty. Please add products to your cart before placing an order.',
    });
  }
  next();
};
