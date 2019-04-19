const { spawn } = require('child_process');

const ml = {};

// env model path
// env

ml.readRatesPrediction = ({rates=[],steps=3,model_id='ml_model_foo'}={})=>new Promise((resolve,reject)=>{
  const {stdout,stderr} = spawn('python3',[
  '../ml/predict.py',
  '--future', steps,
  `--input`, JSON.stringify(rates),
  '--model',`./sample_data/${model_id}.pt`
  // api should either manage model locs, or hand that off to ml
  // depends on when/how/why we create new models. May vary if we add users
  ]);
  stderr.on('data', reject);
  stdout.on('data', rates=>resolve(JSON.parse(rates)));
});
// .
module.exports = ml
