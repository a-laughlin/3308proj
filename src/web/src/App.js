
/* eslint-disable no-unused-vars */
import React,{useState} from 'react';
import './App.css';
import {useHeartRateQuery,query,mutate,isLoading,isError,isData} from './state';
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
  const queryResult = useHeartRateQuery(props); // graphql query
  if(isLoading(queryResult)) {
    return <svg style={s`w100 h100 dB op.7`}><text>Loading...</text></svg>
  };
  if(isError(queryResult)) {
    return <svg style={s`w100 h100 dB op.7`}><text>`${queryResult}`</text></svg>
  };
  const [historical_hr,predicted_hr] = queryResult.hr; // destructure array
  return (
    <svg style={s`w100 h100 dB op.7`}>
      <rect style={s`w100 h100 fillF`}/>
      <polyline points={beatsToXYStr(predicted_hr.beats)} {...s`strk990 strkw1 fillT`}/>
      <polyline points={xy_vals} {...s`strkw1 strk009 fillT`}/>
      {x_vals.map((x,i) =>
        <text key={i} style={s(`fill0 transy${i*5}`)}>{x}</text>
      )}
      <text style={s`fill0 transy100`}>{JSON.stringify(data)}</text>
    </svg>);
}


const Svg2 = Svg(
  children(pipe(useHeartRateQuery,cond(
    [isLoading,Text('Loading...')],
    [isError,e=>Text(`${e}`)],
    [isData,({hr:[ {beats:hist,freq}, {beats:pred} ]}) =>[
      Text(freq,style(`fill009 transy10`)),
      Polyline(style(`strkw1 fillT strk009 transy10`), prop('points',p=>beatsToXYStr(hist))),
      Polyline(style(`strkw1 fillT strk990 transy50`), prop('points',p=>beatsToXYStr(pred))),
    ]]
  )))
);


const AdamExperiment2 = Div(
  state('rabbits','more',2),
  children(
    Svg2,
    p=>Div(`Rabbits:${p.rabbits}`,style('bg4BB fh fJCC')),
    ({more,rabbits})=>Button('More Rabbits!', onClick((btnProps,evt)=>more(rabbits*2))),
    p=>Button('More HeartRates!', onClick((_,evt)=>{
      // this updates the whole state... well, maybe only the part with hr
      // how update a field?
      // how update a list?
      mutate({query:'{hr {beats, freq, id, start, end }}'})(data=>({
        hr:[data.hr[0],{...data.hr[1],beats:[...data.hr[1].beats,50]}]
      }))
    })),
  ),
  style('w100 h100 bg299 t80 lh140 fv fAIC fJCSE usN crD'),
  oo('more')
)


export const App = props=>
// <img src="https://news.bitcoin.com/wp-content/uploads/2017/08/Markcap.png" alt="" style={s`w100 posA dB`} />
  <div {...props} style={s`taC`}>
    <div style={s`posF w100 h50 oH bgFFF`}><SvgMain/></div>
    <div style={s`posF w100 h50 oH bottom0 bg077`}><AdamExperiment2/></div>
  </div>;

export default App;
/* eslint-enable no-unused-vars */
