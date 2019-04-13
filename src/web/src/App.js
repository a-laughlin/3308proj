/* eslint-disable no-unused-vars */
import React from 'react';
import {useHeartRateQuery,query,predictHeartRates,isLoading,isError,isData} from './state';
import {Div,Pre,Button,Svg,Text,style,children,prop,state,onClick,toDstr,fromDstr
} from './hooks'
import {styleStringToObj as s} from './style-string-to-obj'
import data from './sample_data/ml_output_foo.json';
import {plog,pipe,get,oo,has,cond,is,ma,flatMap,pget} from './utils';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
/* eslint-enable no-unused-vars */

const ratesToObjs = ({ghr,phr})=>
  [...ghr,...phr].map((r,i)=>({name:i,[i>=ghr.length?'phr':'ghr']:r}));


const DataMain = pipe(useHeartRateQuery({id:6}),cond(
  [isLoading,x=><div>Loading...</div>],
  [isError,x=><div>x</div>],
  [isData,({heartRatePredictions:[{rates:phr,history:{rates:ghr}}]})=>
    <LineChart width={1200} height={600} data={ratesToObjs({ghr,phr})} margin={{top:5, right:20, bottom:5, left:0}}>
      <Line type="monotone" dataKey="ghr" stroke={'#42A5F5'} />
      <Line type="monotone" dataKey="phr" stroke={'#42A5F5'} strokeDasharray="5 5" />
      <CartesianGrid stroke="#ccc" strokeDasharray="2 2"/>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    </LineChart>
  ]
));

export const App = props=>
  <div {...props} style={s`taC`}>
    <div style={s`bg900000 ts26px tcFFF tBold`}>Heart-a-tracker</div>
    <DataMain />
  </div>;

export default App;


// for reference on local state
// const AdamExperiment2 = Div(
//   state('rabbits','more',2),
//   style('w100 h100 bg299 t80 lh140 fv fAIC fJCSE usN crD'),
//   children(
//     Svg2,
//     p=>Div(`Rabbits:${p.rabbits}`,style('bg4BB fh fJCC')),
//     ({more,rabbits})=>Button('More Rabbits!', onClick((btnProps,evt)=>more(rabbits*2))),
//     p=>Button('More HeartRates!', onClick(predictHeartRates(1))),
//   ),
//   oo('more')
// )
