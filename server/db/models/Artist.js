const Sequelize = require('sequelize')
const db = require('../db')


const Artist = db.define('artist', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imagePath: {
    type: Sequelize.TEXT,
    defaultValue: "/Generic.png"
  },
});


module.exports = Artist
