/* eslint-disable import/no-extraneous-dependencies */
const Sequelize = require('sequelize');

const sequelize = require('../sql-database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
});

module.exports = User;
