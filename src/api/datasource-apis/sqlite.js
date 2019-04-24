const SRC = `${__dirname}/../../`;
const API = `${SRC}/api`;
const DB = `${API}/db.sqlite`; // db file
const SAMPLE_DATA = `${API}/sample_data`;
const SLEEPS = `${SAMPLE_DATA}/sleeps.json`;

// note: all datasource-apis functions return a promise
// a common way to read data async data

const sqlite={};

sqlite.createSleeps = (sleeps)=>{
  // inserts sleeps objects into the database
}

sqlite.readSleeps = ()=>{
  // if already in db
  // read sleeps from the database
}

module.exports = sqlite

// need to run this once to get the current file into the db
// require(`${__dirname}/filesystem.js`)
// .readSleeps()
// .then(sqlite.createSleeps)
