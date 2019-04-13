const fs = require("fs");

function loadHeartRateLists(heartRateLists){
  const heartRateListsLoc = "../web/src/sample_data/hr.json";
  try{
    return heartRateLists || require(heartRateListsLoc);
  } catch(e){
    const sleep = require('../web/src/sample_data/oura_2019-03-05T18-00-21.json').sleep;
    const heartRateLists = sleep.reduce((o,v,i)=>{
      o[i]={
        id:i,
        start:v.bedtime_start,
        end:v.bedtime_end,
        freq:30000,
        rates:v.hr_5min
      };
      return o;
    },{});

    fs.writeFile(heartRateListsLoc, JSON.stringify(heartRateLists), (err, data)=> {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });
    return heartRateLists;
  }
}
module.exports = loadHeartRateLists
