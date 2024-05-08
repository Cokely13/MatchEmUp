const { db } = require('../server/db');
const nflseed = require('./nflseed');
const nbaseed = require('./nbaseed');
const musicseed = require('./musicseed');
const movieseed = require('./movieseed');
const stateseed = require('./stateseed');

async function seedAll() {
  console.log('Starting the seeding process...');

  try {
    // Drop and recreate tables
    await db.sync({ force: true });
    console.log('Database synced!');

    // Run each seed function
    await nflseed();
    console.log('NFL data seeded!');

    await nbaseed();
    console.log('NBA data seeded!');

    await musicseed();
    console.log('Music data seeded!');

    await stateseed();
    console.log('State data seeded!');

    await movieseed();
    console.log('Movie data seeded!');

  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1); // Exit with error code
  } finally {
    await db.close();
    console.log('Database connection closed.');
  }
}

seedAll();
