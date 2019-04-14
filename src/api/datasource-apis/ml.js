const { spawn } = require('child_process');

const ml = {};

ml.readRatesPrediction = ({rates,steps}={})=>new Promise((resolve,reject)=>{
  const {stdout,stderr} = spawn('python3',[
  '../ml/predict.py',
  '--future', steps,
  `--input`, JSON.stringify(rates),
  // '--model',model_id,
  // api should either manage model locs, or hand that off to ml
  // depends on when/how/why we create new models. May vary if we add users
  ]);
  stderr.on('data', reject);
  stdout.on('data', rates=>resolve(JSON.parse(rates)));
});

module.exports = ml
