
'use strict';

const axios = require('axios');
const { db, models: { State, City } } = require('../server/db');

const API_KEY = 'e6d4ff784de271fd73b3af4a080e13aaafc5a59b';

// Helper function to clean city names
// function cleanCityName(cityName) {
//   // Removes ' city,' and anything following it
//   // Adds removal of ' county,' and anything following it
//   // Adds conditional removal of ' town,' only if it follows a space and anything after it
//   return cityName.replace(/ city,.*$/, '')
//                   .replace(/ County,.*$/i, '') // Case-insensitive removal of ' County,' and anything following it
//                   .replace(/ county,.*$/i, '') // Case-insensitive removal of ' county,' and anything following it
//                   .replace(/ metropolitan,.*$/i, '') // Case-insensitive removal of ' county,' and anything following it
//                   .replace(/ village,.*$/i, '') // Case-insensitive removal of ' village,' and anything following it
//                   .replace(/ metro,.*$/i, '') // Case-insensitive removal of ' county,' and anything following it
//                   .replace(/\b and\b,.*$/, '') // Removes ' and,' and anything following it when 'and' is a standalone word
//                   .replace(/ municipality,.*$/i, '') // Case-insensitive removal of ' county,' and anything following it
//                  .replace(/ town,.*$/, '') // Removes ' town,' followed by anything
//                  .replace(/\b town\b$/, '') // Removes ' town' if it's at the end of the string
//                  .replace(/\/.*$/, ''); // Removes anything after a '/'
// }

function cleanCityName(cityName) {
  return cityName
    .replace(/ city,.*$/, '') // Removes ' city,' and anything following it
    .replace(/ County,.*$/i, '') // Case-insensitive removal of ' County,' and anything following it
    .replace(/ county,.*$/i, '') // Case-insensitive removal of ' county,' and anything following it
    .replace(/ metropolitan,.*$/i, '') // Case-insensitive removal of ' metro,' and anything following it
    .replace(/ municipality,.*$/i, '') // Case-insensitive removal of ' municipality,' and anything following it
    .replace(/ town,.*$/, '') // Removes ' town,' followed by anything
    .replace(/ village,.*$/i, '') // Case-insensitive removal of ' village,' and anything following it
    .replace(/\b town\b$/, '') // Removes ' town' if it's at the end of the string
    .replace(/\band\b,.*$/, '') // Removes ' and,' and anything following it when 'and' is a standalone word
    .replace(/\/.*$/, '') // Removes anything after a '/'
    .replace(/\(.*\)$/, '') // Removes anything within parentheses at the end of the string
    .trim(); // Removes any leading/trailing whitespace that might be left
}


// Function to map state codes to state names
function getStateName(stateCode) {
  const stateMap = {
    '01': 'Alabama', '02': 'Alaska', '04': 'Arizona', '05': 'Arkansas',
    '06': 'California', '08': 'Colorado', '09': 'Connecticut', '10': 'Delaware',
    '11': 'District of Columbia', '12': 'Florida', '13': 'Georgia',
    '15': 'Hawaii', '16': 'Idaho', '17': 'Illinois', '18': 'Indiana',
    '19': 'Iowa', '20': 'Kansas', '21': 'Kentucky', '22': 'Louisiana',
    '23': 'Maine', '24': 'Maryland', '25': 'Massachusetts', '26': 'Michigan',
    '27': 'Minnesota', '28': 'Mississippi', '29': 'Missouri', '30': 'Montana',
    '31': 'Nebraska', '32': 'Nevada', '33': 'New Hampshire', '34': 'New Jersey',
    '35': 'New Mexico', '36': 'New York', '37': 'North Carolina', '38': 'North Dakota',
    '39': 'Ohio', '40': 'Oklahoma', '41': 'Oregon', '42': 'Pennsylvania',
    '44': 'Rhode Island', '45': 'South Carolina', '46': 'South Dakota',
    '47': 'Tennessee', '48': 'Texas', '49': 'Utah', '50': 'Vermont',
    '51': 'Virginia', '53': 'Washington', '54': 'West Virginia',
    '55': 'Wisconsin', '56': 'Wyoming', '60': 'American Samoa', '66': 'Guam',
    '69': 'Northern Mariana Islands', '72': 'Puerto Rico', '78': 'U.S. Virgin Islands'
  };

  return stateMap[stateCode] || stateCode;
}

const stateImageMap = {
  'Alabama': '/alabama.jpg',
  'Alaska': '/alaska.jpg',
  'Arizona': '/arizona.jpg',
  'Arkansas': '/arkansas.jpg',
  'California': '/california.jpg',
  'Colorado': '/colorado.jpg',
  'Connecticut': '/connecticut.jpg',
  'Delaware': '/delaware.jpg',
  'District of Columbia': '/district-of-columbia.jpg',
  'Florida': '/florida.jpg',
  'Georgia': '/georgia.jpg',
  'Hawaii': '/hawaii.jpg',
  'Idaho': '/idaho.jpg',
  'Illinois': '/illinois.jpg',
  'Indiana': '/indiana.jpg',
  'Iowa': '/iowa.jpg',
  'Kansas': '/kansas.jpg',
  'Kentucky': '/kentucky.jpg',
  'Louisiana': '/louisiana.jpg',
  'Maine': '/maine.jpg',
  'Maryland': '/maryland.jpg',
  'Massachusetts': '/massachusetts.jpg',
  'Michigan': '/michigan.jpg',
  'Minnesota': '/minnesota.jpg',
  'Mississippi': '/mississippi.jpg',
  'Missouri': '/missouri.jpg',
  'Montana': '/montana.jpg',
  'Nebraska': '/nebraska.jpg',
  'Nevada': '/nevada.jpg',
  'New Hampshire': '/new-hampshire.jpg',
  'New Jersey': '/new-jersey.jpg',
  'New Mexico': '/new-mexico.jpg',
  'New York': '/new-york.jpg',
  'North Carolina': '/north-carolina.jpg',
  'North Dakota': '/north-dakota.jpg',
  'Ohio': '/ohio.jpg',
  'Oklahoma': '/oklahoma.jpg',
  'Oregon': '/oregon.jpg',
  'Pennsylvania': '/pennsylvania.jpg',
  'Rhode Island': '/rhode-island.jpg',
  'South Carolina': '/south-carolina.jpg',
  'South Dakota': '/south-dakota.jpg',
  'Tennessee': '/tennessee.jpg',
  'Texas': '/texas.jpg',
  'Utah': '/utah.jpg',
  'Vermont': '/vermont.jpg',
  'Virginia': '/virginia.jpg',
  'Washington': '/washington.jpg',
  'West Virginia': '/west-virginia.jpg',
  'Wisconsin': '/wisconsin.jpg',
  'Wyoming': '/wyoming.jpg',
  // Include territories if needed
};

async function fetchStatesAndCities() {
  const response = await axios.get(`https://api.census.gov/data/2019/pep/population?get=NAME,POP&for=place:*&key=${API_KEY}`);
  let data = response.data;
  let stateCities = {};

  // Organize cities under each state and sort by population
  data.forEach(item => {
    const [cityName, population, stateCode] = item;
    const cleanName = cleanCityName(cityName);
    const stateName = getStateName(stateCode); // Get the proper state name using the function
    if (!stateCities[stateName]) stateCities[stateName] = [];
    stateCities[stateName].push({ cityName: cleanName, population: parseInt(population, 10) });
  });

  // Sort and select the top 4 cities for each state
  for (const stateName in stateCities) {
    stateCities[stateName] = stateCities[stateName].sort((a, b) => b.population - a.population).slice(0, 4);
  }

  // Create State and City entries in the database
  for (const stateName in stateCities) {
    const imageUrl = stateImageMap[stateName] || '/images/generic.jpg'; // Use the map, fallback to a generic image if not found
    const stateInstance = await State.create({ name: stateName, imagePath: imageUrl });
    for (const city of stateCities[stateName]) {
      await City.create({ name: city.cityName, stateId: stateInstance.id });
    }
  }
}

async function stateseed() {
  console.log('Seeding state and city data...');
  try {
    // await db.sync({ force: true }); // Clears db and matches models to tables
    // console.log('DB synced!');
    await fetchStatesAndCities();
    console.log('State and city data seeded successfully');
  } catch (err) {
    console.error('Error seeding data:', err);
    throw err; // Throw the error so the exit code can be set appropriately
  }
}

if (module === require.main) {
  stateseed();
}

module.exports = stateseed;
