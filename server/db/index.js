//this is the access point for all things database related!

const db = require('./db')

// const User = require('./models/User')
const Actor = require('./models/Actor')
const Movie = require('./models/Movie')
const Quarterback = require('./models/Quarterback')
const Receiver = require('./models/Receiver')

//associations could go here!
Actor.hasMany(Movie);
Movie.belongsTo(Actor);
Quarterback.hasMany(Receiver);
Receiver.belongsTo(Quarterback);

module.exports = {
  db,
  models: {
    // User,
    Actor,
    Movie,
    Quarterback,
    Receiver
  },
}
