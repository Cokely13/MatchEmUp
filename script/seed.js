'use strict';

const fs = require('fs');
const csv = require('csv-parser');
const { db, models: { Actor, Movie, Quarterback, Receiver, User, Song, Album, Artist, Player, Franchise} } = require('../server/db');
const axios = require('axios');

async function seed() {
  await db.sync({ force: true }); // Clears db and matches models to tables
  console.log('db synced!');

  await processCsvData();


const API_KEY = '6e56a81fd7f7f0fb08932517fef4fc86';

async function fetchAlbumTracks(mbid) {
  if (!mbid) {
    console.log('Missing MBID for fetching tracks.');
    return [];
  }
  const url = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&mbid=${mbid}&format=json`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data || !data.album || !data.album.tracks || !data.album.tracks.track) {
    console.error(`No tracks found for album with MBID: ${mbid}`);
    return [];
  }

  return data.album.tracks.track.map(track => ({
    name: track.name,
    duration: track.duration // or any other relevant data
  }));
}

// Fetch and create artists, albums, and songs
async function fetchAndCreateMusicData() {
  const artists = await fetchTopArtists();
  for (const artistData of artists) {
    const artist = await Artist.create({ name: artistData.name }); // Create artist
    const topAlbumsData = await fetchTopAlbums(artist.name);

    for (const albumData of topAlbumsData) {
      if (!albumData.name) {
        console.log(`Skipping album creation for ${artist.name} due to missing data.`);
        continue;
      }

      const album = await Album.create({
        title: albumData.name,
        artistId: artist.id,
        imagePath: albumData.imagePath || '/Generic.png' // Use default image if none provided
      });

      const tracks = await fetchAlbumTracks(albumData.mbid);
      for (const trackData of tracks) {
        await Song.create({
          name: trackData.name,
          albumId: album.id
        });
      }
    }
  }
}

// Fetch the top 10 artists from Last.fm
async function fetchTopArtists() {
  const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json&limit=10`;
  const response = await fetch(url);
  const data = await response.json();
  return data.artists.artist;
}

// Fetch the top album of a given artist, including image paths
async function fetchTopAlbums(artistName) {
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&api_key=${API_KEY}&artist=${encodeURIComponent(artistName)}&format=json&limit=4`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.topalbums || !data.topalbums.album.length) {
    console.error(`No albums found for artist: ${artistName}`);
    return [];
  }

  return data.topalbums.album.map(album => ({
    name: album.name,
    mbid: album.mbid,
    imagePath: (album.image.find(img => img.size === 'large') || { '#text': '/Generic.png' })['#text']
  }));
}

async function updateArtistImages() {
  const artistImages = {
    'Taylor Swift': '/Taylor.jpg',
    'The Weeknd': '/Weeknd.jpg',
    'Kanye West': '/Kanye.jpg',
    'Drake': '/Drake.jpg',
    'Lana Del Rey': '/Lana.jpg',
    'Kendrick Lamar': '/Kendrick.jpg',
    'Ariana Grande': '/Ariana.jpg',
    'Tyler, the Creator': '/Tyler.jpg',
    'Beyoncé': '/Beyonce.jpg',
    'Rihanna': '/Rihanna.jpg',
    'Artic Monkeys': '/artic.jpg',
  };

  for (const artistName in artistImages) {
    const imagePath = artistImages[artistName];
    await Artist.update({ imagePath: imagePath }, { where: { name: artistName } });
  }
}

// Initiate fetching and creating process
await fetchAndCreateMusicData();
await updateArtistImages();

  // // Process actors and movies from 'fixed.csv'
  // const actorMovieResults = await new Promise((resolve, reject) => {
  //   const results = [];
  //   fs.createReadStream('script/fixed.csv')
  //     .pipe(csv({
  //       mapHeaders: ({ header, index }) => index === 0 ? 'actor' : 'movie',
  //     }))
  //     .on('data', (data) => results.push([data.actor, data.movie]))
  //     .on('end', () => {
  //       resolve(results);
  //     })
  //     .on('error', reject);
  // });

  // for (const [actorName, movieName] of actorMovieResults) {
  //   let actor = await Actor.findOne({ where: { name: actorName } });
  //   if (!actor) {
  //     actor = await Actor.create({ name: actorName });
  //   }
  //   await Movie.create({ name: movieName, actorId: actor.id });
  // }

  // // Update actors with images from 'images.csv'
  // const actorImagesResults = await new Promise((resolve, reject) => {
  //   const results = [];
  //   fs.createReadStream('script/images.csv')
  //     .pipe(csv())
  //     .on('data', (data) => results.push(data))
  //     .on('end', () => {
  //       resolve(results);
  //     })
  //     .on('error', reject);
  // });

  // for (const result of actorImagesResults) {
  //   const { Actor: actorName, Images: imagePath } = result;
  //   await Actor.update({ imagePath }, { where: { name: actorName } });
  // }

const API_KEY2 = '46bc0d05e584bfed1df9ee4d1ae6c6a6';
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchPopularActors() {
  const url = `${BASE_URL}/person/popular?api_key=${API_KEY2}&language=en-US&page=1`;
  const response = await axios.get(url);
  return response.data.results.slice(0, 25);
}

async function fetchTopMoviesForActor(personId) {
  const url = `${BASE_URL}/person/${personId}/movie_credits?api_key=${API_KEY2}&language=en-US`;
  const response = await axios.get(url);
  const movies = response.data.cast;
  return movies.sort((a, b) => b.popularity - a.popularity).slice(0, 10);
}

async function updateActorsAndMovies() {
  const actors = await fetchPopularActors();

  for (const actorData of actors) {
    const actor = await Actor.create({
      name: actorData.name,
      imagePath: `https://image.tmdb.org/t/p/w500${actorData.profile_path}`
    });

    const movies = await fetchTopMoviesForActor(actorData.id);
    for (const movieData of movies) {
      await Movie.create({
        name: movieData.title,
        imagePath: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
        ActorId: actor.id  // Assuming ActorId is the foreign key in the Movie model
      });
    }
  }
}

async function run() {
  try {
    await db.sync(); // Make sure your database is synced
    await updateActorsAndMovies();
    console.log('Successfully updated actors and their movies');
  } catch (error) {
    console.error('Failed to update data:', error);
  } finally {
    await db.close();
  }
}

run();


  // Process quarterbacks and receivers from 'data.csv'
  const qbReceiverResults = await new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream('script/data.csv')
      .pipe(csv({
        mapHeaders: ({ header, index }) => index === 0 ? 'receiver' : 'quarterback',
      }))
      .on('data', (data) => results.push([data.receiver, data.quarterback]))
      .on('end', () => {
        resolve(results);
      })
      .on('error', reject);
  });

  for (const [receiverName, qbName] of qbReceiverResults) {
    let qb = await Quarterback.findOne({ where: { name: qbName } });
    if (!qb) {
      qb = await Quarterback.create({ name: qbName });
    }
    await Receiver.create({ name: receiverName, quarterbackId: qb.id });
  }

  // Update quarterbacks with hardcoded images
  const quarterbackImages = {
    'Brady': '/Brady.jpg',
    'Rodgers': '/rodgers.jpg',
    'Peyton': '/Peyton.jpg',
    'Brees': '/brees.jpg',
    'Favre': '/favre.jpg',
    'Eli': '/eli.jpg',
    'Ryan': '/Ryan.jpg',
    'Marino': '/marino.jpg',
    'Roethlisberger': '/Ben.jpg',
    'Rivers': '/Rivers.jpg',
    // Add other quarterbacks and their image paths as needed
  };

  for (const qbName in quarterbackImages) {
    const imagePath = quarterbackImages[qbName];
    await Quarterback.update({ imagePath }, { where: { name: qbName } });
  }

  console.log('Seeded successfully');
}


async function processCsvData() {
  const franchises = {};

  const franchisePromises = {};

  const dataStream = fs.createReadStream('script/bball.csv').pipe(csv());
  for await (const row of dataStream) {
      const { Name, Image, Team, Year } = row;

      if (!franchises[Team]) {
          if (!franchisePromises[Team]) {
              // Promise to find or create the franchise, stored to prevent duplicate creations
              franchisePromises[Team] = Franchise.findOrCreate({
                  where: { team: Team },
                  defaults: { team: Team, year: Year }
              })
              .then(([franchise]) => {
                  franchises[Team] = franchise;
                  return franchise;
              });
          }
          // Wait for the franchise to be processed or found
          await franchisePromises[Team];
      }

      // Create the player and associate with the franchise
      await Player.create({
          name: Name,
          imagePath: Image,
          franchiseId: franchises[Team].id
      });
  }

  console.log('CSV file successfully processed');
  console.log('Seeding completed');



   // Update quarterbacks with hardcoded images
   const franchiseImages = {
    'Lakers': '/lakers.png',
    'Heat': '/heat.png',
    'Celtics': '/celtics.png',
    'Bucks': '/bucks.png',
    'Cavs': '/cavs.png',
    'Mavs': '/mavs.png',
    'Warriors': '/warriors.png',
    'Raptors': '/raptors.png',
    'Nuggets': '/nuggets.png',
    'Spurs': '/spurs.png',
    // Add other quarterbacks and their image paths as needed
  };

  for (const franchiseName in franchiseImages) {
    const imagePath = franchiseImages[franchiseName];
    await Franchise.update({ imagePath }, { where: { team: franchiseName } });
  }


}

async function runSeed() {
  console.log('Seeding...')
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('Closing db connection');
    await db.close();
    console.log('Db connection closed');
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = seed;
