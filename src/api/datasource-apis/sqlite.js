const SRC = `${__dirname}/../../`;
const API = `${SRC}/api`;
const DB = `${API}/db.sqlite`; // db file

// note: all datasource-apis functions return a promise
// a common way to read data async data

const sqlite={};

sqlite.createSleeps = (sleeps)=>{
  // inserts a sleeps objects into the database
}

sqlite.readSleeps = ()=>{
  // if already in db
  // read sleeps from the database
}

module.exports = sqlite

// need to run this once to get the current file into the db
// require(`./filesystem.js`)
// .readSleeps()
// .then(sqlite.createSleeps)
