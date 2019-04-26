const SRC = `${__dirname}/../../`;
const API = `${SRC}/api`;
const DB = `${API}/3308proj.sqlite`; // db file
const sqlite3 = require('sqlite');


const dbPromise = sqlite3.open(DB,{ Promise, verbose:true })
.then(db=>db.migrate({
  // force: 'last',
  migrationsPath:`${__dirname}/migrations`
}));
const withLoadedDb = fn=>()=>dbPromise.then(db=>fn(db));

const sqlite={};

sqlite.readSleeps = withLoadedDb(db=>
  Promise.all([
    db.all(`select summary_date, hr_5min as rates from "minutes"`),
    db.all(`select summary_date, bedtime_start, bedtime_end from "days"`)
  ])
  .then(([minutes,days])=>{
    const minutes_by_summary_date = minutes.reduce((acc,min)=>{
      const {summary_date, rates} = min;
      acc[summary_date] || (acc[summary_date] = [])
      acc[summary_date].push(rates);
      return acc;
    },{});
    return days.reduce((acc,day)=>{
      acc[day.summary_date] || (acc[day.summary_date]=day);
      day.rates=minutes_by_summary_date[day.summary_date].slice(0,10)
      day.freq=30000;
      return acc;
    },{});
  })
  .catch(err=>{
    console.error(err);
    return err;
  })
);

sqlite.readSleeps()

module.exports = sqlite

// need to run this once to get the current file into the db
// require(`./filesystem.js`)
// .readSleeps()
// .then(sqlite.createSleeps)
