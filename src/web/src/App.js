/* eslint-disable no-unused-vars */
import React from 'react';
import {useHeartRateQuery,query,predictHeartRates,isLoading,isError,isData} from './graphql-client';
import {style,children,prop,state,onClick,toDstr,fromDstr
} from './hooks'
import {styleStringToObj as s} from './style-string-to-obj'
import {plog,pipe,get,oo,has,cond,is,ma,flatMap,pget} from './utils';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
/* eslint-enable no-unused-vars */

const ratesToObjs = ({Given_Heart_Rate,Predicted_Heart_Rate})=>
  [...Given_Heart_Rate,...Predicted_Heart_Rate].map((r,i)=>({name:i,[i>=Given_Heart_Rate.length?'Predicted_Heart_Rate':'Given_Heart_Rate']:r}));


export const DataMain = pipe(useHeartRateQuery({summary_date:"2018-11-05",steps:20}),cond(
  [isLoading,x=><div>Loading....</div>],
  [isError,({errors})=><pre>{errors}</pre>],
  [isData,({data:{heartRatePredictions:[{rates:Predicted_Heart_Rate,history:{rates:Given_Heart_Rate}}]}})=>
    <LineChart width={window.innerWidth} height={window.innerWidth/3} data={ratesToObjs({Given_Heart_Rate,Predicted_Heart_Rate})} margin={{top:5, right:20, bottom:5, left:0}}>
      <Line type="monotone" dataKey="Given_Heart_Rate" stroke={'#42A5F5'} />
      <Line type="monotone" dataKey="Predicted_Heart_Rate" stroke={'#42A5F5'} strokeDasharray="5 5" />
      <CartesianGrid stroke="#ccc" strokeDasharray="2 2"/>
      <XAxis dataKey="name" />
      <Legend />
      <YAxis />
      <Tooltip />
    </LineChart>
  ]
));

export const App = props=>
  <div {...props} style={s`taC`}>
    <div style={s`bgFFF ts26px tc000 tBold fJCS`}>Heart-a-tracker</div>
    <DataMain />
    <div><text><a href="https://github.com/a-laughlin/3308proj">Click here for more information about the project.</a></text></div>
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
