'use strict';

const fs = require('fs');
const csv = require('csv-parser');
const { db, models: { Actor, Movie, Quarterback, Receiver, User, Song, Album, Artist, Player, Franchise} } = require('../server/db');

async function seed() {
  await db.sync({ force: true }); // Clears db and matches models to tables
  console.log('db synced!');

  await processCsvData();

//   const API_KEY = '6e56a81fd7f7f0fb08932517fef4fc86';

//   // Fetch and create artists, albums, and songs
//   async function fetchPopularAlbumsAndTracks() {
//     const artists = await fetchTopArtists();
//     for (const artistData of artists) {
//       const artist = await Artist.create({ name: artistData.name }); // Create artist
//       const topAlbumData = await fetchTopAlbums(artist.name);

//       if (!topAlbumData || !topAlbumData.name) {
//         console.log(`Skipping album creation for artist: ${artistData.name} due to missing data.`);
//         continue;  // Skip this iteration if no album data is found
//       }

//       const album = await Album.create({ // Create album
//         title: topAlbumData.name,
//         artistId: artist.id
//       });

//       const tracks = await fetchAlbumTracks(topAlbumData.mbid);
//       for (const trackData of tracks) {
//         await Song.create({ // Create song
//           name: trackData.name,
//           albumId: album.id
//         });
//       }
//     }
//   }

//   // Fetch the top 10 artists from Last.fm
//   async function fetchTopArtists() {
//     const urlTopArtists = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json&limit=10`;
//     const response = await fetch(urlTopArtists);
//     const data = await response.json();
//     return data.artists.artist; // Returns an array of top 10 artists
//   }

//   // Fetch the top album of a given artist
//   async function fetchTopAlbums(artistName) {
//     const urlTopAlbums = `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&api_key=${API_KEY}&artist=${encodeURIComponent(artistName)}&format=json&limit=4`;
//     const response = await fetch(urlTopAlbums);
//     const data = await response.json();

//     if (!data.topalbums || !data.topalbums.album.length) {
//       console.error(`No albums found for artist: ${artistName}`);
//       return [];  // Return an empty array if no albums are found
//     }

//     return data.topalbums.album; // Returns the top 4 albums for the artist
// }

//   // Fetch tracks for a given album using its MusicBrainz ID (mbid)
//   async function fetchPopular() {
//     const artists = await fetchTopArtists();
//     for (const artistData of artists) {
//         const artist = await Artist.create({ name: artistData.name }); // Create artist

//         const topAlbumsData = await fetchTopAlbums(artist.name);
//         for (const albumData of topAlbumsData) {
//             if (!albumData || !albumData.name) {
//                 console.log(`Skipping album creation for ${artistData.name} due to missing data.`);
//                 continue; // Skip this iteration if no album data is found
//             }

//             await Album.create({ // Create album
//                 title: albumData.name,
//                 artistId: artist.id
//             });
//         }
//     }
// }

// async function updateArtistImages() {
//   const artistImages = {
//       'Taylor Swift': '/Taylor.jpg',
//       'The Weeknd': '/Weeknd.jpg',
//       'Kanye West': '/Kanye.jpg',
//       'Drake': '/Drake.jpg',
//       'Lana Del Rey': '/Lana.jpg',
//       'Kendrick Lamar': '/Kendrick.jpg',
//       'Ariana Grande': '/Ariana.jpg',
//       'Tyler, the Creator': '/Tyler.jpg',
//       'Beyoncé': '/Beyonce.jpg',
//       'Rihanna': '/Rihanna.jpg',
//   };

//   for (const artistName in artistImages) {
//       const imagePath = artistImages[artistName];
//       await Artist.update({ imagePath: imagePath }, { where: { name: artistName } });
//   }
// }

//   // Initiate fetching and creating process
//   await fetchPopular();
//   await fetchPopularAlbumsAndTracks();
//   await updateArtistImages();

const API_KEY = '6e56a81fd7f7f0fb08932517fef4fc86';

// Fetch and create artists, albums, and songs
async function fetchPopularAlbumsAndTracks() {
  const artists = await fetchTopArtists();
  for (const artistData of artists) {
    const artist = await Artist.create({ name: artistData.name }); // Create artist
    const topAlbumData = await fetchTopAlbums(artist.name);

    if (!topAlbumData || !topAlbumData.name) {
      console.log(`Skipping album creation for artist: ${artistData.name} due to missing data.`);
      continue;  // Skip this iteration if no album data is found
    }

    const album = await Album.create({ // Create album
      title: topAlbumData.name,
      artistId: artist.id
    });

    const tracks = await fetchAlbumTracks(topAlbumData.mbid);
    for (const trackData of tracks) {
      await Song.create({ // Create song
        name: trackData.name,
        albumId: album.id
      });
    }
  }
}

// Fetch the top 10 artists from Last.fm
async function fetchTopArtists() {
  const urlTopArtists = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json&limit=10`;
  const response = await fetch(urlTopArtists);
  const data = await response.json();
  return data.artists.artist; // Returns an array of top 10 artists
}

// Fetch the top album of a given artist
async function fetchTopAlbums(artistName) {
  const urlTopAlbums = `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&api_key=${API_KEY}&artist=${encodeURIComponent(artistName)}&format=json&limit=4`;
  const response = await fetch(urlTopAlbums);
  const data = await response.json();

  if (!data.topalbums || !data.topalbums.album.length) {
    console.error(`No albums found for artist: ${artistName}`);
    return [];  // Return an empty array if no albums are found
  }

  return data.topalbums.album; // Returns the top 4 albums for the artist
}

// Fetch tracks for a given album using its MusicBrainz ID (mbid)
async function fetchPopularAlbumsAndTracks() {
  const artists = await fetchTopArtists();
  for (const artistData of artists) {
      const artist = await Artist.create({ name: artistData.name }); // Create artist

      const topAlbumsData = await fetchTopAlbums(artist.name);
      for (const albumData of topAlbumsData) {
          if (!albumData || !albumData.name) {
              console.log(`Skipping album creation for ${artistData.name} due to missing data.`);
              continue; // Skip this iteration if no album data is found
          }

          await Album.create({ // Create album
              title: albumData.name,
              artistId: artist.id
          });
      }
  }
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
};

for (const artistName in artistImages) {
    const imagePath = artistImages[artistName];
    await Artist.update({ imagePath: imagePath }, { where: { name: artistName } });
}
}

// Initiate fetching and creating process
await fetchPopularAlbumsAndTracks();
await updateArtistImages();

  // Process actors and movies from 'fixed.csv'
  const actorMovieResults = await new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream('script/fixed.csv')
      .pipe(csv({
        mapHeaders: ({ header, index }) => index === 0 ? 'actor' : 'movie',
      }))
      .on('data', (data) => results.push([data.actor, data.movie]))
      .on('end', () => {
        resolve(results);
      })
      .on('error', reject);
  });

  for (const [actorName, movieName] of actorMovieResults) {
    let actor = await Actor.findOne({ where: { name: actorName } });
    if (!actor) {
      actor = await Actor.create({ name: actorName });
    }
    await Movie.create({ name: movieName, actorId: actor.id });
  }

  // Update actors with images from 'images.csv'
  const actorImagesResults = await new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream('script/images.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', reject);
  });

  for (const result of actorImagesResults) {
    const { Actor: actorName, Images: imagePath } = result;
    await Actor.update({ imagePath }, { where: { name: actorName } });
  }

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

// async function processCsvData() {

// const franchises = {};

// fs.createReadStream('script/bball.csv')
//   .pipe(csv())
//   .on('data', async (row) => {
//     // Destructure the row into respective fields
//     const { Name, Image, Team, Year } = row;

//     // Create or find the team
//     if (!franchises[Team]) {
//       // Try to find the franchise or create it if it does not exist
//       const [franchise, created] = await Franchise.findOrCreate({
//           where: { team: Team },
//           defaults: { team: Team, year: Year }
//       });
//       franchises[Team] = franchise;
//   }

//     // Create the player and associate with the team
//     const player = await Player.create({
//       name: Name,
//       imagePath: Image,
//       franchiseId: franchises[Team].id
//     });
//   })


//   .on('end', () => {
//     console.log('CSV file successfully processed');
//     console.log('Seeding completed');
//   })
//   .on('error', (err) => {
//     console.error('Error while reading CSV:', err);
//   });

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
    'Cavaliers': '/cavs.png',
    'Mavericks': '/mavs.png',
    'Warriors': '/warrios.png',
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
