'use strict';

const fs = require('fs');
const csv = require('csv-parser');
const { db, models: { Player, Franchise } } = require('../server/db');

async function nbaseed() {
  // await db.sync({ force: true });
  // console.log('NBA DB synced!');

  const franchises = {};

  const franchisePromises = {};

  const dataStream = fs.createReadStream('script/bball.csv').pipe(csv());
  for await (const row of dataStream) {
      const { Name, Image, Team, Year } = row;

      if (!franchises[Team]) {
          if (!franchisePromises[Team]) {
              // Promise to find or create the franchise, stored to prevent duplicate creations
              franchisePromises[Team] = Franchise.findOrCreate({
                  where: { name: Team },
                  defaults: { name: Team, year: Year }
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
    await Franchise.update({ imagePath }, { where: { name: franchiseName } });
  }


}

async function runSeedNba() {
  console.log('Seeding...')
  try {
    await nbaseed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

if (module === require.main) {
  runSeedNba();
}

module.exports = nbaseed;
