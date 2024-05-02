const Sequelize = require('sequelize')
const db = require('../db')


const NbaPlayer = db.define('nbaplayer', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imagePath: {
    type: Sequelize.TEXT,
    defaultValue: "/Generic.png"
  },
});


module.exports = NbaPlayer
