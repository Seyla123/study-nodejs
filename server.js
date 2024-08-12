const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

// import database MySQL and MongoDB
//const { syncDatabase } = require('./controllers/productController');
const mongodb = require('./mongo-datebase');
const app = require('./app-express');

const port = process.env.PORT || 3000;
//syncDatabase();
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(()=>{
    process.exit(1);
  });
})