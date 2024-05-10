'use strict';

const axios = require('axios');
const { db, models: { Show, Character } } = require('../server/db');

const API_KEY = '46bc0d05e584bfed1df9ee4d1ae6c6a6';
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchPopularTVShows() {
  let allShows = [];
  let page = 1;
  const desiredCount = 50;

  while (allShows.length < desiredCount) {
      const url = `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
      const response = await axios.get(url);
      allShows = allShows.concat(response.data.results);

      if (response.data.results.length === 0 || allShows.length >= desiredCount) {
          break;
      }

      page++;
  }

  return allShows.slice(0, 50);
}

async function fetchCharactersForShow(showId) {
    const url = `${BASE_URL}/tv/${showId}/credits?api_key=${API_KEY}&language=en-US`;
    const response = await axios.get(url);
    return response.data.cast.slice(0, 4);
}

async function updateShowsAndCharacters() {
  const shows = await fetchPopularTVShows();

  for (const showData of shows) {
      // Fetch characters for the show
      const characters = await fetchCharactersForShow(showData.id);

      // Check if there are at least 4 characters
      if (characters.length >= 4) {
          // Only create the show if there are at least 4 characters
          const [show, created] = await Show.findOrCreate({
              where: { name: showData.name },
              defaults: {
                  name: showData.name,
                  imagePath: `https://image.tmdb.org/t/p/w500${showData.poster_path}`
              }
          });

          // Create each character associated with the show
          for (const charData of characters) {
              await Character.create({
                  name: charData.name,
                  imagePath: `https://image.tmdb.org/t/p/w500${charData.profile_path}`,
                  ShowId: show.id  // Ensuring that Character is linked to Show
              });
          }
      } else {
          console.log(`Skipping show ${showData.name} as it does not have at least 4 characters.`);
      }
  }
}

async function runSeed() {
    console.log('Starting to seed data from TMDB...');
    try {
        await updateShowsAndCharacters();
        console.log('Successfully seeded shows and characters from TMDB');
    } catch (error) {
        console.error('Failed to seed data:', error);
        process.exitCode = 1;
    } finally {
        console.log('Closing DB connection');
        await db.close();
        console.log('DB connection closed');
    }
}

if (module === require.main) {
    runSeed();
}

module.exports = updateShowsAndCharacters;
