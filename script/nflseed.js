'use strict';

const fs = require('fs');
const csv = require('csv-parser');
const { db, models: { Quarterback, Receiver } } = require('../server/db');

async function nflseed() {
  // await db.sync({ force: true });
  // console.log('NFL DB synced!');

  // Reading from the CSV file for quarterbacks and receivers
  const qbReceiverResults = await new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream('script/data.csv')
      .pipe(csv({
        mapHeaders: ({ header, index }) => index === 0 ? 'receiver' : 'quarterback',
      }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });

  // Creating Quarterback and Receiver entries
  for (const { receiver, quarterback } of qbReceiverResults) {
    let qb = await Quarterback.findOne({ where: { name: quarterback } });
    if (!qb) {
      qb = await Quarterback.create({ name: quarterback });
    }
    await Receiver.create({ name: receiver, quarterbackId: qb.id });
  }

  // Update quarterbacks with hardcoded images
  const quarterbackImages = {
    'Brady': '/Brady.jpg',
    'Rodgers': '/rodgers.jpg',
    'Peyton': '/Peyton.jpg',
    'Brees': '/brees.jpg',
    'Favre': '/favre.jpg',
    'Eli': '/eli.jpg',
    'Ryan': '/Ryan.jpg',
    'Marino': '/marino.jpg',
    'Roethlisberger': '/Ben.jpg',
    'Rivers': '/Rivers.jpg',
  };

  for (const qbName in quarterbackImages) {
    const imagePath = quarterbackImages[qbName];
    await Quarterback.update({ imagePath }, { where: { name: qbName } });
  }

  console.log('NFL Seeded successfully');
}

async function runSeedNFL() {
  console.log('Seeding NFL...');
  try {
    await nflseed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('Closing NFL db connection');
    await db.close();
    console.log('NFL Db connection closed');
  }
}

if (module === require.main) {
  runSeedNFL();
}

module.exports = nflseed;
