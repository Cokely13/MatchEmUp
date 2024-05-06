const Sequelize = require('sequelize')
const db = require('../db')


const Album = db.define('album', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imagePath: {
    type: Sequelize.TEXT,
    defaultValue: "/Generic.png"
  },
});


module.exports = Album
