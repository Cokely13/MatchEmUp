const Sequelize = require('sequelize')
const db = require('../db')


const Show= db.define('show', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imagePath: {
    type: Sequelize.TEXT,
    defaultValue: "/Generic.png"
  },
});


module.exports = Show
