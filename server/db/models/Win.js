const Sequelize = require('sequelize');
const db = require('../db');

const Win = db.define('win', {
  category: {
    type: Sequelize.ENUM,
    values: ['Shows', 'State', 'Music', 'Qb', 'Nba', 'Movies'],
    allowNull: false
  },
  count: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

module.exports = Win;
