//this is the access point for all things database related!

const db = require('./db')

// const User = require('./models/User')
const Actor = require('./models/Actor')
const Album = require('./models/Album')
const Artist = require('./models/Artist')
const Movie = require('./models/Movie')
const Quarterback = require('./models/Quarterback')
const Receiver = require('./models/Receiver')
const Song= require('./models/Song')

//associations could go here!
Actor.hasMany(Movie);
Movie.belongsTo(Actor);
Quarterback.hasMany(Receiver);
Receiver.belongsTo(Quarterback);

Artist.hasMany(Album, { foreignKey: 'artistId' });
Album.belongsTo(Artist, { foreignKey: 'artistId' });

Album.hasMany(Song, { foreignKey: 'albumId' });
Song.belongsTo(Album, { foreignKey: 'albumId' });

module.exports = {
  db,
  models: {
    // User,
    Actor,
    Movie,
    Quarterback,
    Receiver,
    Song,
    Album,
    Artist
  },
}
