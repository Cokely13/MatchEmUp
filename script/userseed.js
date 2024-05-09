const { db, models: { User} } = require('../server/db');

async function seed() {

const users = await Promise.all([
  User.create({ username: 'Ryan', email: "ryan.cokely@gmail.com",  password: '123', admin: true }),
  User.create({ username: 'Ac', email: "ac@gmail.com",  password: '123' }),
  User.create({ username: 'Val', email: "val@gmail.com",  password: '123' }),
  User.create({ username: 'Jeff', email: "jeff@gmail.com",  password: '123' }),
]);

console.log(`seeded ${users.length} users`);
  console.log(`users seeded successfully`);
  // return {
  //   users: {
  //     cody: users[0],
  //     murphy: users[1],
  //   },
  // };
}

async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = seed;
