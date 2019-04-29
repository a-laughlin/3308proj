const SRC = `${__dirname}/../../`;
const API = `${SRC}/api`;
const DB = `${API}/3308proj.sqlite`; // db file
const sqlite3 = require('sqlite');
const fs = require('fs');
const zip = require('lodash/zip')
const flatMap = require('lodash/flatMap')

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
    const minutes_by_summary_date = minutes.reduce((acc,{summary_date, rates})=>{
      acc[summary_date] || (acc[summary_date] = [])
      acc[summary_date].push(rates);
      return acc;
    },{});
    return days.reduce((acc,day)=>{
      acc[day.summary_date] || (acc[day.summary_date]=day);
      day.rates=minutes_by_summary_date[day.summary_date]
      day.freq=30000;
      return acc;
    },{});
  })
  .catch(err=>{
    console.error(err);
    return err;
  })
);


const identity = x=>x;
const stepDate = (d,steps=0)=>(new Date(Date.parse(d)+(300000*steps))).toISOString();

const tables = {
  days:[
    {oura_key:"summary_date",map_schema:()=>'"summary_date" TEXT PRIMARY KEY',
      map_val:v=>`"${stepDate(v).slice(0,10)}"`,},
    {oura_key:"restless",map_schema:()=>'"restless" INTEGER',
      map_val:identity,},
    {oura_key:"midpoint_at_delta",map_schema:()=>'"midpoint_at_delta" INTEGER',
      map_val:identity,},
    {oura_key:"bedtime_start",map_schema:()=>'"bedtime_start" TIMESTAMP',
      map_val:v=>`"${stepDate(v)}"`,},
    {oura_key:"midpoint_time",map_schema:()=>'"midpoint_time" INTEGER',
      map_val:identity,},
    {oura_key:"onset_latency",map_schema:()=>'"onset_latency" INTEGER',
      map_val:identity,},
    {oura_key:"hr_lowest",map_schema:()=>'"hr_lowest" INTEGER',
      map_val:identity,},
    {oura_key:"score_deep",map_schema:()=>'"score_deep" INTEGER',
      map_val:identity,},
    {oura_key:"total",map_schema:()=>'"total" INTEGER',
      map_val:identity,},
    {oura_key:"period_id",map_schema:()=>'"period_id" INTEGER',
      map_val:identity,},
    {oura_key:"bedtime_start_delta",map_schema:()=>'"bedtime_start_delta" INTEGER',
      map_val:identity,},
    {oura_key:"score",map_schema:()=>'"score" INTEGER',
      map_val:identity,},
    {oura_key:"light",map_schema:()=>'"light" INTEGER',
      map_val:identity,},
    {oura_key:"bedtime_end",map_schema:()=>'"bedtime_end" TIMESTAMP',
      map_val:v=>`"${stepDate(v)}"`,},
    {oura_key:"score_efficiency",map_schema:()=>'"score_efficiency" INTEGER',
      map_val:identity,},
    {oura_key:"score_total",map_schema:()=>'"score_total" INTEGER',
      map_val:identity,},
    {oura_key:"duration",map_schema:()=>'"duration" INTEGER',
      map_val:identity,},
    {oura_key:"rem",map_schema:()=>'"rem" INTEGER',
      map_val:identity,},
    {oura_key:"score_latency",map_schema:()=>'"score_latency" INTEGER',
      map_val:identity,},
    {oura_key:"awake",map_schema:()=>'"awake" INTEGER',
      map_val:identity,},
    {oura_key:"is_longest",map_schema:()=>'"is_longest" INTEGER',
      map_val:identity,},
    {oura_key:"hr_average",map_schema:()=>'"hr_average" REAL',
      map_val:identity,},
    {oura_key:"score_disturbances",map_schema:()=>'"score_disturbances" INTEGER',
      map_val:identity,},
    {oura_key:"breath_average",map_schema:()=>'"breath_average" REAL',
      map_val:identity,},
    {oura_key:"efficiency",map_schema:()=>'"efficiency" INTEGER',
      map_val:identity,},
    {oura_key:"score_alignment",map_schema:()=>'"score_alignment" INTEGER',
      map_val:identity,},
    {oura_key:"deep",map_schema:()=>'"deep" INTEGER',
      map_val:identity,},
    {oura_key:"bedtime_end_delta",map_schema:()=>'"bedtime_end_delta" INTEGER',
      map_val:identity,},
    {oura_key:"timezone",map_schema:()=>'"timezone" INTEGER',
      map_val:identity,},
    {oura_key:"temperature_delta",map_schema:()=>'"temperature_delta" REAL',
      map_val:identity,},
    {oura_key:"score_rem",map_schema:()=>'"score_rem" INTEGER',
      map_val:identity,},
  ],
  minutes:[
    {oura_key:"minute",map_schema:()=>'"minute" TEXT PRIMARY KEY',
      map_val:(_,sleep)=>sleep.hr_5min.map((v,i)=>`"${stepDate(sleep.summary_date,i)}"`),},
    {oura_key:"summary_date",map_schema:()=>'"summary_date" TIMESTAMP',
      map_val:(_,sleep)=>sleep.hr_5min.map(x=>`"${stepDate(sleep.summary_date).slice(0,10)}"`),},
    {oura_key:"hr_5min",map_schema:()=>'"hr_5min" INTEGER',
      map_val:identity,},
    {oura_key:"rmssd_5min",map_schema:()=>'"rmssd_5min" INTEGER',
      map_val:identity,},
    {oura_key:"hypnogram_5min",map_schema:()=>'"hypnogram_5min" INTEGER',
      map_val:(hypnogram_5min,sleep)=>sleep.hr_5min.map(_=>(+(hypnogram_5min[0])||0))},
  ]
};

const tables_migration = ()=>(
  `-- Up\n`+
  Object.entries(tables).map(([tk,t])=>(
    `DROP TABLE IF EXISTS ${tk};\n`+
    `CREATE TABLE ${tk} (\n`+
      t.map(v=>'  '+v.map_schema()).join(',\n')+'\n'+
    `);`
  )).join('\n')+'\n'+
  '\n'+
  '-- Down\n'+
  Object.keys(tables).map(k=>`DROP TABLE IF EXISTS ${k};`).join('\n')+
  '\n'
);

const values_migration = (oura_obj)=>(
  '-- Up\n'+
  Object.entries(tables).map(([tk,t])=>(
    oura_obj.sleep.map(sleep=>t.map(o=>o.map_val(sleep[o.oura_key],sleep)))
    .map(vals=>Array.isArray(vals[0]) ? zip(...vals) : [vals])
    .map(vals=>vals.map(v=>`INSERT INTO ${tk} VALUES(${v.join(',')});`).join('\n'))
  ).join('\n')).join('\n\n')+
  '\n\n'+
  `-- Down\n`+
  Object.keys(tables).map(k=>`DELETE FROM ${k};`).join('\n')+
  '\n'
);

sqlite.write_oura_migrations = (oura_obj)=>{
  const tables_path = `${__dirname}/migrations/0001-add_days_minutes_tables.sql`;
  fs.writeFileSync(tables_path, tables_migration(), 'utf8','w')
  const values_path = `${__dirname}/migrations/0002-insert_days_minutes_values.sql`;
  fs.writeFileSync(values_path, values_migration(oura_obj), 'utf8','w')
}
// console.log(sqlite.write_oura_migrations(require('./oura_2019-04-28T18-05-30.json')));


module.exports = sqlite;
