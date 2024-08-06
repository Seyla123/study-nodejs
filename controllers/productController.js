/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
const sequelize = require('../sql-database');

const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');
const Order = require('../models/order');
const OrderItem = require('../models/order-item');


Product.belongsTo(User, { constrains: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

async function syncDatabase() {
  try {
    await sequelize.sync(); // Use { force: true } to drop tables if they exist
    console.log('Database synced successfully');
    const user = await User.findByPk(2);
    if(!user) {
      return User.create({
        name: 'admin',
        email: 'test@mail.com'
      })
    };
    //user.createCart();
    return user;
  } catch (err) {
    console.error('Error syncing database:', err);
  }
}
async function addProduct(name, price, description, imageUrl,userId) {
  try {
    const product = await userId.createProduct({
      name: name,
      price,
      description,
      imageUrl,
    });
    return product;
  } catch (err) {
    console.error('Error creating product:', err);
  }
}
async function findProduct(id) {
  try {
    const product = await Product.findByPk(id);
    return product;
  } catch (error) {
    console.log('error:', error);
  }
}

async function findProductByWhere(findId) {
  try {
    const product = await Product.findAll({
      where: {
        id: findId,
      },
    });
    console.log('Product found:', product);
  } catch (error) {
    console.log('error:', error);
  }
}
// addProduct('new Product1', 10, 'sdfasdfsadf', 'pfg.jpg');

const fecthAlProducts = async (userReq) => {
  try {
    const products = await userReq.getProducts();
    return products;
  } catch (error) {
    console.log('error:', error);
  }
};
async function fecthAlProductsByQuery() {
  try {
    const [products, meta] = await sequelize.query('SELECT * FROM products');
    console.log('Products:', products);
  } catch (error) {
    console.log('error:', error);
  }
}

async function updateProduct(id, title, price, description, imageUrl) {
  try {
    const product = await Product.findByPk(id);
    product.name = title;
    product.price = price;
    product.description = description;
    product.imageUrl = imageUrl;
    return await product.save();
  } catch (error) {
    console.log('updateerror:', error);
  }
}


async function deleteProduct(id) {
  try {
    const product = await Product.findByPk(id);
    return await product.destroy();
  } catch (error) {
    console.log('detele error:', error);
  }
}

const allProduct = async (req, res) => {
  const products = await fecthAlProducts(req.requestUser);
  console.log('products:', products);
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
};
const getProduct = async (req, res) => {
  const getProduct = await findProduct(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      product: getProduct,
    },
  });
};

const createProduct = async (req, res) => {
  const newProduct = await addProduct(
    req.body.name, 
    req.body.price, 
    req.body.description, 
    req.body.imageUrl,
    req.requestUser,  // Assuming that req.body.userId is the id of the user who created the product. You can replace it with your actual logic.
  );
  res.status(200).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  });
};

const editProduct = async (req, res) => {
  const updatedProduct = await updateProduct(
    req.params.id,
    req.body.name,
    req.body.price,
    req.body.description,
    req.body.imageUrl
  );
  res.status(200).json({
    status: 'success',
    data: {
      product: updatedProduct,
    },
  });
};

const removeProduct = async (req, res) => {
  const deletedProduct = await deleteProduct(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      product: deletedProduct,
    },
  });
}

const checkId = async(req, res, next, val) => {
  console.log(`Product id is : ${val}`);
  const id = req.params.id;
  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(404).json({
      status: 'fail',
      message: `Invalid ID : ${id}`,
    });
  }
  next();
}

const checkBody = async(req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
}
module.exports = {
  allProduct,
  getProduct,
  createProduct,
  editProduct,
  removeProduct,
  checkId,
  checkBody,
  syncDatabase
};
