const fs = require("fs");

// apparently require happens from this directory
// and fs.writeFile happens from the calling directory
// so use the absolute path
// We need better directory handling via envs.
const SAMPLE_DIR = `${__dirname}/../../web/src/sample_data`;
const ALL_DATA = `${SAMPLE_DIR}/oura_2019-03-05T18-00-21.json`;
const HEARTRATE_LISTS = `${SAMPLE_DIR}/hr.json`;
const SLEEPS = `${SAMPLE_DIR}/sleeps.json`;

const fileSystem = {};
const loaded = {};

fileSystem.readSleeps = ()=>{
  try{
    return Promise.resolve(loaded.sleeps || (loaded.sleeps = require(SLEEPS)));
  } catch(e){
    return new Promise((resolve,reject)=>{
      console.log(`loading all`);
      const sleeps = require(ALL_DATA).sleep.reduce((o,v,i)=>{
        o[i]={
          ...v,
          // add other props for current API compatibility
          id:i,
          freq:30000,
          start:v.bedtime_start,
          end:v.bedtime_end,
          rates:v.hr_5min
        };
        return o;
      },{});
      fs.writeFile(SLEEPS, JSON.stringify(sleeps), 'utf8', (err, data)=> {
        if (err) {
          console.error(err);
          reject(err);
        }
        resolve(sleeps);
      });
    })
  }
}

module.exports = fileSystem
