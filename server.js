const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

// import database MySQL and MongoDB
const { syncDatabase } = require('./controllers/productController');
const mongodb = require('./mongo-datebase');
const app = require('./app-express');

const port = process.env.PORT || 3000;
//syncDatabase();
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
