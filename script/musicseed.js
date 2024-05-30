'use strict';

const axios = require('axios');
const { db, models: { Artist, Album } } = require('../server/db');

const API_KEY = '6e56a81fd7f7f0fb08932517fef4fc86';
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchAndCreateMusicData() {
  const artists = await fetchTopArtists();
  for (const artistData of artists) {
    const tmdbImagePath = await fetchArtistImageFromTMDB(artistData.name);
    const artist = await Artist.create({
      name: artistData.name,
      imagePath: tmdbImagePath || artistData.imagePath
    });
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

async function fetchTopArtists() {
  const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json&limit=10`;
  try {
    const response = await axios.get(url);
    return response.data.artists.artist.map(artist => ({
        name: artist.name,
        imagePath: artist.image.find(img => img.size === 'large') ? artist.image.find(img => img.size === 'large')['#text'] : '/Generic.png'
    }));
  } catch (error) {
    console.error('Failed to fetch artists:');
    return [];
  }
}

// async function fetchArtistImageFromTMDB(artistName) {
//   const searchUrl = `${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(artistName)}`;
//   try {
//     const response = await axios.get(searchUrl);
//     if (response.data.results.length > 0) {
//       const artistInfo = response.data.results[0];
//       return artistInfo.profile_path ? `https://image.tmdb.org/t/p/w500${artistInfo.profile_path}` : null;
//     }
//   } catch (error) {
//     console.error(`Failed to fetch TMDB image for ${artistName}:`);
//   }
//   return null;
// }

async function fetchTopAlbums(artistName) {
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&api_key=${API_KEY}&artist=${encodeURIComponent(artistName)}&format=json&limit=4`;
  try {
    const response = await axios.get(url);
    return response.data.topalbums.album.map(album => ({
        name: album.name,
        imagePath: album.image.find(img => img.size === 'large') ? album.image.find(img => img.size === 'large')['#text'] : '/Generic.png'
    }));
  } catch (error) {
    console.error(`No albums found for ${artistName}:`);
    return [];
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
    'Arctic Monkeys': '/artic.jpg',
  };

  for (const artistName in artistImages) {
    const imagePath = artistImages[artistName];
    await Artist.update({ imagePath: imagePath }, { where: { name: artistName } });
  }
}

async function musicseed() {
  console.log('Seeding music data...');
  try {
    await fetchAndCreateMusicData();
    await updateArtistImages();
    console.log('Music Seeded successfully');
  } catch (err) {
    console.error('Error seeding music data:', err);
    throw err;
  }
}

if (module === require.main) {
  musicseed();
}

module.exports = musicseed;

