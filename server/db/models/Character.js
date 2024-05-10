const Sequelize = require('sequelize')
const db = require('../db')


const Character = db.define('character', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imagePath: {
    type: Sequelize.TEXT,
    defaultValue: "/Generic.png"
  },
});


module.exports = Character
