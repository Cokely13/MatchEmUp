const Sequelize = require('sequelize')
const db = require('../db')


const Player = db.define('player', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imagePath: {
    type: Sequelize.TEXT,
    defaultValue: "/Generic.png"
  },
});


module.exports = Player
