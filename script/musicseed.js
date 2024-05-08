
'use strict';

const axios = require('axios');
const { db, models: { Artist, Album } } = require('../server/db');

const API_KEY = '6e56a81fd7f7f0fb08932517fef4fc86';

async function fetchAndCreateMusicData() {
  const artists = await fetchTopArtists();
  for (const artistData of artists) {
    const artist = await Artist.create({ name: artistData.name });
    const topAlbumsData = await fetchTopAlbums(artist.name);

    for (const albumData of topAlbumsData) {
      if (!albumData.name) {
        console.log(`Skipping album creation for ${artist.name} due to missing data.`);
        continue;
      }

      await Album.create({
        title: albumData.name,
        artistId: artist.id,
        imagePath: albumData.imagePath || '/Generic.png'
      });
    }
  }
}

// async function fetchTopArtists() {
//   const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json&limit=10`;
//   const response = await axios.get(url);
//   return response.data.artists.artist;
// }

// async function fetchTopArtists() {
//   const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json&limit=10`;
//   const response = await axios.get(url);
//   return response.data.artists.artist.map(artist => ({
//     name: artist.name,
//     imagePath: artist.image ? artist.image[3]['#text'] : '/Generic.png'  // Assumes 'image' is an array and index 3 is the desired size
//   }));
// }

async function fetchTopArtists() {
  const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json&limit=10`;
  try {
      const response = await axios.get(url);
      if (response.data && response.data.artists && response.data.artists.artist) {
          return response.data.artists.artist.map(artist => ({
              name: artist.name,
              imagePath: artist.image && artist.image.length > 3 ? artist.image[3]['#text'] : '/Generic.png'  // Check if the image array exists and has at least four elements
          }));
      } else {
          console.log('No artist data found:', response.data);
          return [];  // Return an empty array if no artist data is available
      }
  } catch (error) {
      console.error('Failed to fetch artists:', error);
      return [];  // Return an empty array on error
  }
}


async function fetchTopAlbums(artistName) {
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&api_key=${API_KEY}&artist=${encodeURIComponent(artistName)}&format=json&limit=4`;
  const response = await axios.get(url);
  const data = response.data;

  if (!data.topalbums || !data.topalbums.album.length) {
    console.error(`No albums found for artist: ${artistName}`);
    return [];
  }

  return data.topalbums.album.map(album => ({
    name: album.name,
    imagePath: (album.image.find(img => img.size === 'large') || { '#text': '/Generic.png' })['#text']
  }));
}

// async function updateArtistImages() {
//   const artistImages = {
//     'Taylor Swift': '/Taylor.jpg',
//     'The Weeknd': '/Weeknd.jpg',
//     'Kanye West': '/Kanye.jpg',
//     'Drake': '/Drake.jpg',
//     'Lana Del Rey': '/Lana.jpg',
//     'Kendrick Lamar': '/Kendrick.jpg',
//     'Ariana Grande': '/Ariana.jpg',
//     'Tyler, the Creator': '/Tyler.jpg',
//     'Beyoncé': '/Beyonce.jpg',
//     'Rihanna': '/Rihanna.jpg',
//     'Arctic Monkeys': '/artic.jpg',
//   };

//   for (const artistName in artistImages) {
//     const imagePath = artistImages[artistName];
//     await Artist.update({ imagePath: imagePath }, { where: { name: artistName } });
//   }
// }

async function musicseed() {
  console.log('Seeding music data...');
  try {
    // await db.sync({ force: true }); // Clears db and matches models to tables
    // console.log('Music DB synced!');
    await fetchAndCreateMusicData();
    // await updateArtistImages();
    console.log('Music Seeded successfully');
  } catch (err) {
    console.error('Error seeding music data:', err);
    throw err; // Throw the error so the exit code can be set appropriately
  }
}

if (module === require.main) {
  musicseed();
}

module.exports = musicseed;
