const Sequelize = require('sequelize')
const db = require('../db')


const NbaTeam = db.define('nbateam', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  year: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imagePath: {
    type: Sequelize.STRING,
    defaultValue: "/Generic.png"
  },
});


module.exports = NbaTeam
