

'use strict';

const axios = require('axios');
const { db, models: { Actor, Movie } } = require('../server/db');

const API_KEY = '46bc0d05e584bfed1df9ee4d1ae6c6a6';
const BASE_URL = 'https://api.themoviedb.org/3';

// async function fetchPopularActors() {
//     const url = `${BASE_URL}/person/popular?api_key=${API_KEY}&language=en-US&page=1`;
//     const response = await axios.get(url);
//     return response.data.results.slice(0, 25);
// }

async function fetchPopularActors() {
    const url = `${BASE_URL}/person/popular?api_key=${API_KEY}&language=en-US&page=1`;
    const response = await axios.get(url);
    let actors = response.data.results;

    // Check if the response contains less than 30 actors and a second page is available
    if (actors.length < 30 && response.data.total_pages >= 2) {
        const nextPageUrl = `${BASE_URL}/person/popular?api_key=${API_KEY}&language=en-US&page=2`;
        const nextPageResponse = await axios.get(nextPageUrl);
        actors = actors.concat(nextPageResponse.data.results);
    }

    return actors.slice(0, 30);
}

async function fetchTopMoviesForActor(personId) {
    const url = `${BASE_URL}/person/${personId}/movie_credits?api_key=${API_KEY}&language=en-US`;
    const response = await axios.get(url);
    const movies = response.data.cast;
    return movies.sort((a, b) => b.popularity - a.popularity).slice(0, 10);
}

async function updateActorsAndMovies() {
    const actors = await fetchPopularActors();

    for (const actorData of actors) {
        const [actor, created] = await Actor.findOrCreate({
            where: { name: actorData.name },
            defaults: {
                name: actorData.name,
                imagePath: `https://image.tmdb.org/t/p/w500${actorData.profile_path}`
            }
        });

        if (created) {
            const movies = await fetchTopMoviesForActor(actorData.id);
            for (const movieData of movies) {
                await Movie.create({
                    name: movieData.title,
                    imagePath: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
                    ActorId: actor.id  // Ensuring that Movie is linked to Actor
                });
            }
        }
    }
}

async function runSeed() {
    console.log('Starting to seed data from TMDB...');
    try {
        await updateActorsAndMovies();
        console.log('Successfully seeded actors and movies from TMDB');
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

module.exports = updateActorsAndMovies;
