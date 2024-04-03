// 'use strict'

// const fs = require('fs');
// const csv = require('csv-parser');
// const { db, models: { Actor, Movie, User } } = require('../server/db');

// async function seed() {
//   await db.sync({ force: true }); // Clears db and matches models to tables
//   console.log('db synced!');

//   // Moved CSV reading logic here
//   const results = await new Promise((resolve, reject) => {
//     const results = [];
//     fs.createReadStream('script/actor.csv') // Ensure correct path
//       .pipe(csv({
//         mapHeaders: ({ header, index }) => index === 0 ? 'movie' : 'actor',
//       }))
//       .on('data', (data) => results.push([data.movie, data.actor]))
//       .on('end', () => {
//         resolve(results);
//       })
//       .on('error', reject);
//   });

//   // Process results after CSV read is complete
//   for (const result of results) {
//     const [movieName, actorName] = result;
//     let actor = await Actor.findOne({ where: { name: actorName } });

//     if (!actor) {
//       actor = await Actor.create({ name: actorName });
//     }

//     await Movie.create({ name: movieName, actorId: actor.id });
//   }

//   // const actorImages = {
//   //   'Anne Hathaway': '/anne.jpg',
//   //   'Ben Affleck': '/benA.jpg',
//   //   'Eddie Murphy': '/eddie.jpg',
//   //   'George Clooney': '/george.jpg',
//   //   'Kate Winslet': '/kate.jpg',
//   //   'Leonardo DiCaprio': '/leo.jpg',
//   //   'Matt Damon': '/matt.jpg',
//   //   'Meryl Streep': '/meryl.jpg',
//   //   'Tom Hanks': '/tomH.jpg',
//   //   'Will Smith': '/will.jpg',


//   // };

//   // Update quarterback images
// for (const actorName in actorImages) {
//   const imagePath = actorImages[actorName];
//  await Actor.update({ imagePath }, { where: { name: actorName } });
// }

//   // Your users creation logic remains the same
//   const users = await Promise.all([
//     User.create({ username: 'cody', password: '123' }),
//     User.create({ username: 'murphy', password: '123' }),
//   ]);

//   console.log(`seeded ${users.length} users`);
//   console.log(`seeded successfully`);
// }




//   // const qbsAndMovies = await readQBsAndMovies();


// /*
//  We've separated the `seed` function from the `runSeed` function.
//  This way we can isolate the error handling and exit trapping.
//  The `seed` function is concerned only with modifying the database.
// */



// async function runSeed() {
//   console.log('seeding...')
//   try {
//     await seed()
//   } catch (err) {
//     console.error(err)
//     process.exitCode = 1
//   } finally {
//     console.log('closing db connection')
//     await db.close()
//     console.log('db connection closed')
//   }
// }

// /*
//   Execute the `seed` function, IF we ran this module directly (`node seed`).
//   `Async` functions always return a promise, so we can use `catch` to handle
//   any errors that might occur inside of `seed`.
// */
// if (module === require.main) {
//   runSeed()
// }

// // we export the seed function for testing purposes (see `./seed.spec.js`)
// module.exports = seed

'use strict';

const fs = require('fs');
const csv = require('csv-parser');
const { db, models: { Actor, Movie, User } } = require('../server/db');

async function seed() {
  await db.sync({ force: true }); // Clears db and matches models to tables
  console.log('db synced!');

  // Moved CSV reading logic here
  const results = await new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream('script/list.csv') // Ensure correct path
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', reject);
  });

  // Process results after CSV read is complete
  for (const result of results) {
    const actorName = result.Actor;
    let actor = await Actor.findOne({ where: { name: actorName } });

    if (!actor) {
      actor = await Actor.create({ name: actorName });
    }

    // Update actor image path if available
    const imagePath = result.Images;
    if (imagePath) {
      await Actor.update({ imagePath }, { where: { name: actorName } });
    }

    // Split movies by newline and add them to the Movie table
    const movies = result.Movies.split('\n');
    for (const movie of movies) {
      const movieName = movie.trim();
      await Movie.create({ name: movieName, actorId: actor.id });
    }
  }

  console.log(`Seeded successfully`);
}

async function runSeed() {
  console.log('Seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('Closing db connection')
    await db.close()
    console.log('Db connection closed')
  }
}

if (module === require.main) {
  runSeed()
}

module.exports = seed;
