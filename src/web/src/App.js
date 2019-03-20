
/* eslint-disable no-unused-vars */
import React,{useState} from 'react';
import './App.css';
import {Div,Button,style,children,prop,state,onClick} from './hooks'
import {styleStringToObj as s} from './style-string-to-obj'
import data from './sample_data/ml_output_foo.json';
import {plog,pipe,get,oo} from './utils';

const text_style = {fill:'#000',transform:'translateY(20%)'}
const x_vals = [100,20,40,60,20,90,80,60,20,100,40,20,20,40,40]
const y_vals = [0,10,15,20,30,40,60,80,120,160,240,320,400,480]
const xy_vals = y_vals.map((y, x) => [x*10, 500-y].join(" "))

export const App = props=>
  <div style={s`taC`}>
    <header style={s`bg077 minh100 fv fAIC tcF`}>
      {/*<AdamExperiment2/>*/}
      <svg style={s`w100 h50 posA z1 op.7`}>
        <rect style={s`w100 h100 fillF`}/>
        <polyline
          points="60 110 65 120 70 115 75 130 80 125 85 140 90 135 95 150 100 145"
          {...s`strk990 strkw1 fillT`}/>
        <polyline points={xy_vals} {...s`strkw1 strk009 fillT`}/>
        {x_vals.map((x,i) =>
          <text key={i} style={s(`fill0 transy${i*10}`)}>{x}</text>
        )}
        <text style={s`fill0 transy100`}>{JSON.stringify(data)}</text>
      </svg>
      <img src="https://news.bitcoin.com/wp-content/uploads/2017/08/Markcap.png" alt="" style={s`w100 posA`} />
    </header>
  </div>;


const AdamExperiment1 = Div(' AdamExperiment1... ');

const AdamExperiment2 = Div(
  state('rabbits','more',2),
  children(
    AdamExperiment1('Random Text'),
    p=>Div(`Rabbits:${p.rabbits}`,style('bg4BB w100 fh fJCC')),
    p=>Button('More Rabbits!',onClick(p.more,fn=>fn(p.rabbits*2))),
    pipe()
  ),
  style('w200px h200px bg299 t80 lh140 fv fAIC fJCSE'),
  oo('more')
)

export default App;
/* eslint-enable no-unused-vars */
