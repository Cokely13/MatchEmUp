

'use strict';

// const fs = require('fs');
// const csv = require('csv-parser');
// const { db, models: { Player, Franchise } } = require('../server/db');

// async function nbaseed() {
//   const franchises = {};
//   const franchisePromises = {};

//   const dataStream = fs.createReadStream('script/bball.csv').pipe(csv());
//   for await (const row of dataStream) {
//       const { Name, Image, Team, Year } = row;
//       const franchiseNameWithYear = `${Team} (${Year})`; // Combining team name and year for the franchise
//       const playerNameWithYear = `${Name} (${Year})`; // Combining player name and year

//       if (!franchises[franchiseNameWithYear]) {
//           if (!franchisePromises[franchiseNameWithYear]) {
//               franchisePromises[franchiseNameWithYear] = Franchise.findOrCreate({
//                   where: { name: franchiseNameWithYear },
//                   defaults: { name: franchiseNameWithYear }
//               }).then(([franchise]) => {
//                   franchises[franchiseNameWithYear] = franchise;
//                   return franchise;
//               });
//           }
//           await franchisePromises[franchiseNameWithYear];
//       }



//       await Player.create({
//           name: playerNameWithYear,
//           imagePath: Image,
//           franchiseId: franchises[franchiseNameWithYear].id
//       });
//   }

//   console.log('CSV file successfully processed');
//   console.log('Seeding completed');


//   const franchiseImages = {
//     'Lakers (2009)': '/lakers.png',
//     'Heat (2012)': '/heat.png',
//     'Celtics (2008)': '/celtics.png',
//      'Bucks (2021)': '/bucks.png',
//      'Cavs (2016)': '/cavs.png',
//      'Mavs (2011)': '/mavs.png',
//      'Warriors (2015)': '/warriors.png',
//      'Raptors (2019)': '/raptors.png',
//      'Nuggets (2023)': '/nuggets.png',
//      'Spurs (2014)': '/spurs.png',
//   };

//   for (const franchiseName in franchiseImages) {
//     const imagePath = franchiseImages[franchiseName];
//     await Franchise.update({ imagePath }, { where: { name: franchiseName } });
//   }
// }

// async function runSeedNba() {
//   console.log('Seeding...')
//   try {
//     await nbaseed();
//   } catch (err) {
//     console.error(err);
//     process.exitCode = 1;
//   }
// }

// if (module === require.main) {
//   runSeedNba();
// }

// module.exports = nbaseed;

'use strict';

const fs = require('fs');
const csv = require('csv-parser');
const { db, models: { Player, Franchise } } = require('../server/db');

async function nbaseed() {
  const franchises = {};
  const dataStream = fs.createReadStream('script/bball.csv').pipe(csv());

  for await (const row of dataStream) {
      const { Name, Image, Team, Year } = row;
      const franchiseNameWithYear = `${Team} (${Year})`; // Combining team name and year for the franchise
      const playerNameWithYear = `${Name} (${Year})`; // Combining player name and year

      if (!franchises[franchiseNameWithYear]) {
          // Find or create the franchise only if it hasn't been processed yet
          const [franchise, created] = await Franchise.findOrCreate({
              where: { name: franchiseNameWithYear },
              defaults: { name: franchiseNameWithYear }
          });
          franchises[franchiseNameWithYear] = franchise; // Store in cache
      }

      // Create the player and associate with the franchise
      await Player.create({
          name: playerNameWithYear,
          imagePath: Image,
          franchiseId: franchises[franchiseNameWithYear].id
      });
  }

  console.log('CSV file successfully processed');
  console.log('Seeding completed');

  // Update franchises with hardcoded images
  const franchiseImages = {
    'Lakers (2009)': '/lakers.png',
    'Lakers (2020)': '/lakers.png',
    'Lakers (2010)': '/lakers.png',
    'Heat (2012)': '/heat.png',
    'Heat (2013)': '/heat.png',
    'Celtics (2008)': '/celtics.png',
    'Bucks (2021)': '/bucks.png',
    'Cavs (2016)': '/cavs.png',
    'Mavs (2011)': '/mavs.png',
    'Warriors (2015)': '/warriors.png',
    'Warriors (2022)': '/warriors.png',
    'Warriors (2017)': '/warriors.png',
    'Warriors (2018)': '/warriors.png',
    'Raptors (2019)': '/raptors.png',
    'Nuggets (2023)': '/nuggets.png',
    'Spurs (2014)': '/spurs.png',
  };

  for (const [franchiseName, imagePath] of Object.entries(franchiseImages)) {
    await Franchise.update({ imagePath }, { where: { name: franchiseName } });
  }
}

async function runSeedNba() {
  console.log('Seeding...');
  try {
    await nbaseed();
    console.log('Seeding complete!');
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exitCode = 1;
  }
}

if (module === require.main) {
  runSeedNba();
}

module.exports = nbaseed;

