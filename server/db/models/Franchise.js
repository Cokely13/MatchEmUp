const Sequelize = require('sequelize')
const db = require('../db')


const Franchise = db.define('franchise', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  // year: {
  //   type: Sequelize.STRING,
  //   allowNull: false,
  // },
  imagePath: {
    type: Sequelize.STRING,
    defaultValue: "/Generic.png"
  },
});


module.exports = Franchise
