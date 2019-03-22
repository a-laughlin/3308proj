
/* eslint-disable no-unused-vars */
import React,{useState} from 'react';
import './App.css';
import {useHeartRateQuery,ifLoad,ifErr,ifData,query,mutate} from './state';
import {Div,Pre,Button,Polyline,Svg,Text,style,children,prop,state,onClick,toDstr,fromDstr
} from './hooks'
import {styleStringToObj as s} from './style-string-to-obj'
import data from './sample_data/ml_output_foo.json';
import {plog,pipe,get,oo,has,cond,is,ma,flatMap,pget} from './utils';
const text_style = {fill:'#000',transform:'translateY(20%)'}
const x_vals = [100,20,40,60,20,90,80,60,20,100,40,20,20,40,40]
const y_vals = [0,10,15,20,30,40,60,80,120,160,240,320,400,480]
const xy_vals = y_vals.map((y, x) => [x*10, 500-y].join(" "))


const beatsToXYStr = b=>b.map((y,x)=>`${x*10} ${100-y}`).join(' ');

export const SvgMain = (props)=>{
  const {loading,data,error} = useHeartRateQuery(props);
  if(error){ return `${error}`; }
  if(loading){ return <div>Loading...</div>; }

  const [historical_hr,predicted_hr] = data.hr;
  return (
    <svg style={s`w100 h50 dB posA op.7 t80`}>
      <rect style={s`w100 h100 fillF`}/>
      <polyline points={beatsToXYStr(predicted_hr.beats)} {...s`strk990 strkw1 fillT`}/>
      <polyline points={xy_vals} {...s`strkw1 strk009 fillT`}/>
      {x_vals.map((x,i) =>
        <text key={i} style={s(`fill0 transy${i*5}`)}>{x}</text>
      )}
      <text style={s`fill0 transy100`}>{JSON.stringify(data)}</text>
    </svg>);
}

// hr {start,end,frequency,beats} is a graphql query.
// using start and end datetime strings makes handling different ranges the most flexible
  // converting start + end into x coords interpolated with
  // "frequency" steps would make sense to me
// {hr:[hist,pred]} is called object and array destructuring
const Svg2 = Svg(
  style(s`w200px h200px`),
  children(pipe(
    useHeartRateQuery,
    ifLoad(Pre),
    ifErr(e=>Pre(`${e}`)),
    ifData(({hr:[ {beats:hist,frequency}, {beats:pred} ]}) =>[
      Text(frequency,style(`fill009 transy10`)),
      Polyline(style(`strkw1 fillT strk009 transy10`), prop('points',p=>beatsToXYStr(hist))),
      Polyline(style(`strkw1 fillT strk990 transy50`), prop('points',p=>beatsToXYStr(pred))),
    ])
  ))
);

const AdamExperiment2 = Div(
  state('rabbits','more',2),
  onClick(()=>{},(x,evt)=>{
    mutate({query:'hr {beats}'});
  }),
  children(
    Svg2,
    p=>Div(`Rabbits:${p.rabbits}`,style('bg4BB w100 fh fJCC')),
    p=>Button('More Rabbits!',onClick(p.more,fn=>fn(p.rabbits*2))),
  ),
  style('w200px h200px bg299 t80 lh140 fv fAIC fJCSE mt50'),
  oo('more')
)


export const App = props=>
  <div {...props} style={s`taC bg077 minh100 fv fAIC tcF`}>
    <img src="https://news.bitcoin.com/wp-content/uploads/2017/08/Markcap.png" alt="" style={s`w100 posA dB`} />
    <SvgMain/>
    <AdamExperiment2/>
  </div>;

export default App;
/* eslint-enable no-unused-vars */
