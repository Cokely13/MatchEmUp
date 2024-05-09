//this is the access point for all things database related!

const db = require('./db')

const User = require('./models/User')
const Actor = require('./models/Actor')
const Album = require('./models/Album')
const Artist = require('./models/Artist')
const Movie = require('./models/Movie')
const Quarterback = require('./models/Quarterback')
const Receiver = require('./models/Receiver')
const Song= require('./models/Song')
const Player = require('./models/Player')
const Franchise = require('./models/Franchise')
const City = require('./models/City')
const State= require('./models/State')

//associations could go here!
// Actor.hasMany(Movie);
// Movie.belongsTo(Actor);
Actor.hasMany(Movie, { foreignKey: 'ActorId' });
Movie.belongsTo(Actor, { foreignKey: 'ActorId' });

Quarterback.hasMany(Receiver);
Receiver.belongsTo(Quarterback);
Franchise.hasMany(Player);
Player.belongsTo(Franchise);
State.hasMany(City);
City.belongsTo(State);

Artist.hasMany(Album, { foreignKey: 'artistId' });
Album.belongsTo(Artist, { foreignKey: 'artistId' });

Album.hasMany(Song, { foreignKey: 'albumId' });
Song.belongsTo(Album, { foreignKey: 'albumId' });

module.exports = {
  db,
  models: {
    User,
    Actor,
    Movie,
    Quarterback,
    Receiver,
    Song,
    Album,
    Artist,
    Player,
    Franchise,
    City,
    State
  },
}
