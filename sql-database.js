// eslint-disable-next-line import/no-extraneous-dependencies
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
connectToDatabase();

module.exports = sequelize;
