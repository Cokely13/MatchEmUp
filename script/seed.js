

// 'use strict';

// const fs = require('fs');
// const csv = require('csv-parser');
// const { db, models: { Actor, Movie } } = require('../server/db');

// async function seed() {
//   await db.sync({ force: true }); // Clears db and matches models to tables
//   console.log('db synced!');

//   // Read actors and movies from cleaned.csv
//   const results = await new Promise((resolve, reject) => {
//     const results = [];
//     fs.createReadStream('script/fixed.csv') // Ensure correct path
//       .pipe(csv({
//         mapHeaders: ({ header, index }) => index === 0 ? 'actor' : 'movie',
//       }))
//       .on('data', (data) => results.push([data.actor, data.movie]))
//       .on('end', () => {
//         resolve(results);
//       })
//       .on('error', reject);
//   });

//   // Process results after CSV read is complete
//   for (const result of results) {
//     const [actorName, movieName] = result;
//     let actor = await Actor.findOne({ where: { name: actorName } });

//     if (!actor) {
//       actor = await Actor.create({ name: actorName });
//     }

//     await Movie.create({ name: movieName, actorId: actor.id });
//   }

//     const imageResults = await new Promise((resolve, reject) => {
//     const results = [];
//     fs.createReadStream('script/images.csv')
//       .pipe(csv())
//       .on('data', (data) => results.push(data))
//       .on('end', () => {
//         resolve(results);
//       })
//       .on('error', reject);
//   });

//   // Process results after CSV read is complete
//   for (const result of imageResults) {
//     const actorName = result.Actor;
//     const imagePath = result.Images;

//     // Find the actor by name and update the image path
//     await Actor.update({ imagePath }, { where: { name: actorName } });
//   }

//   console.log(`Seeded successfully`);
// }

// async function runSeed() {
//   console.log('Seeding...')
//   try {
//     await seed()
//   } catch (err) {
//     console.error(err)
//     process.exitCode = 1
//   } finally {
//     console.log('Closing db connection')
//     await db.close()
//     console.log('Db connection closed')
//   }
// }

// if (module === require.main) {
//   runSeed()
// }

// module.exports = seed;

'use strict';

const fs = require('fs');
const csv = require('csv-parser');
const { db, models: { Actor, Movie, Quarterback, Receiver, User } } = require('../server/db');

async function seed() {
  await db.sync({ force: true }); // Clears db and matches models to tables
  console.log('db synced!');

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

  // Assume image update logic for both actors and quarterbacks remains similar to original scripts
  // Add image path updates for actors and quarterbacks here...

  console.log('Seeded successfully');
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

