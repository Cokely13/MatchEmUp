const Sequelize = require('sequelize')
const db = require('../db')


const Movie = db.define('movie', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imagePath: {
    type: Sequelize.TEXT,
    defaultValue: "/Generic.png"
  },
});


module.exports = Movie
