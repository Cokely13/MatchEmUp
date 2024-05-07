'use strict';

const fs = require('fs');
const csv = require('csv-parser');
const { db, models: { Actor, Movie } } = require('../server/db');

async function movieseed() {
    // await db.sync({ force: true }); // Clears db and matches models to tables
    // console.log('Movie DB synced!');

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

    console.log('Movie Seeded successfully');
}

async function runSeedMovie() {
    console.log('Seeding Movie...');
    try {
        await movieseed();
    } catch (err) {
        console.error('Error seeding movie data:', err);
        process.exitCode = 1;
    } finally {
        console.log('Closing Movie DB connection');
        await db.close();
        console.log('Movie Db connection closed');
    }
}

if (module === require.main) {
    runSeedMovie();
}

module.exports = movieseed;
