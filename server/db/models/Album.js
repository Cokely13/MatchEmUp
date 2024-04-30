const Sequelize = require('sequelize')
const db = require('../db')


const Album = db.define('album', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});


module.exports = Album
