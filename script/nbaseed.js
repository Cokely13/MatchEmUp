'use strict';

const fs = require('fs');
const csv = require('csv-parser');
const { db, models: { Player, Franchise } } = require('../server/db');

async function nbaseed() {
  await db.sync({ force: true });
  console.log('NBA DB synced!');

  const franchises = {};

  fs.createReadStream('script/bball.csv')
    .pipe(csv())
    .on('data', async (row) => {
      const { Name, Image, Team, Year } = row;

      if (!franchises[Team]) {
        franchises[Team] = await Franchise.findOrCreate({
          where: { team: Team },
          defaults: { team: Team, year: Year }
        });
      }

      await Player.create({
        name: Name,
        imagePath: Image,
        franchiseId: franchises[Team][0].id
      });
    })
    .on('end', () => {
      console.log('NBA CSV file successfully processed');
      console.log('NBA Seeding completed');
    })
    .on('error', (err) => {
      console.error('Error while reading NBA CSV:', err);
    });

  // Update franchises with hardcoded images
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
  };

  for (const franchiseName in franchiseImages) {
    const imagePath = franchiseImages[franchiseName];
    await Franchise.update({ imagePath }, { where: { team: franchiseName } });
  }
}

async function runSeedNBA() {
  console.log('Seeding NBA...');
  try {
    await nbaseed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('Closing NBA db connection');
    await db.close();
    console.log('NBA Db connection closed');
  }
}

if (module === require.main) {
  runSeedNBA();
}

module.exports = nbaseed;
