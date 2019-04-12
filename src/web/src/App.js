/* eslint-disable no-unused-vars */
import React from 'react';
import {useHeartRateQuery,query,predictHeartRates,isLoading,isError,isData} from './state';
import {Div,Pre,Button,Polyline,Svg,Text,style,children,prop,state,onClick,toDstr,fromDstr
} from './hooks'
import {styleStringToObj as s} from './style-string-to-obj'
import data from './sample_data/ml_output_foo.json';
import {plog,pipe,get,oo,has,cond,is,ma,flatMap,pget} from './utils';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const beatsToXYStr = b=>b.map((y,x)=>`${(x*30)+100} ${(400-y*2)}`).join(' ');

const Svg2 = Svg(
  children(pipe(useHeartRateQuery,cond(
    [isLoading,Text('Loading...')],
    [isError,e=>Text(`${e}`)],
    [isData,({heartRateList}) =>[
      Polyline(style(`strkw1 fillT strk009 transy10`), 
        prop('points',p=>beatsToXYStr(heartRateList.map(o=>o.rate)))),
      // Polyline(style(`strkw1 fillT strk990 transy50`), prop('points',p=>beatsToXYStr(pred))),
    ]]
  )))
);


const AdamExperiment2 = Div(
  state('rabbits','more',2),
  style('w100 h100 bg299 t80 lh140 fv fAIC fJCSE usN crD'),
  children(
    Svg2,
    p=>Div(`Rabbits:${p.rabbits}`,style('bg4BB fh fJCC')),
    ({more,rabbits})=>Button('More Rabbits!', onClick((btnProps,evt)=>more(rabbits*2))),
    p=>Button('More HeartRates!', onClick(predictHeartRates(1))),
  ),
  oo('more')
)



var myHeader = {
      background: '#900000',
      fontSize: '26px',
      color: 'white',
      fontWeight: 'bold'
    };

const HR = [
{name: '00:00', ghr: [64], phr: null}, 
{name: '00:05', ghr: [77], phr: null},
{name: '00:10', ghr: [66], phr: null},
{name: '00:15', ghr: [80], phr: null}, 
{name: '00:20', ghr: [81], phr: [81]},
{name: '00:25', ghr: null, phr: [77]},
{name: '00:30', ghr: null, phr: [66]},
{name: '00:35', ghr: null, phr: [80]}, 
{name: '00:40', ghr: null, phr: [81]}];

const primaryC = '#42A5F5'
const SvgMain = cond(
  [isLoading,Text('Loading...')],
  [isError,e=>Text(`${e}`)],
  [isData,({heartRateList}) =>{
    console.log(heartRateList)
    return <LineChart width={1200} height={600} data={HR} margin={{top:5, right:20, bottom:5, left:0}}>
      <Line type="monotone" dataKey="ghr" stroke={primaryC} />
      <Line type="monotone" dataKey="phr" stroke={primaryC} strokeDasharray="5 5" />
      <CartesianGrid stroke="#ccc" strokeDasharray="2 2"/>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    </LineChart>
  }]
)


export const App = props=>
  
  <div {...props} style={s`taC`}>
    
    <div style={myHeader}>Heart-a-tracker</div>

    <SvgMain />
        
  </div>;

export default App;
/* eslint-enable no-unused-vars */
