
/* eslint-disable no-unused-vars */
import React,{useState} from 'react';
import './App.css';
import {Div,Button,style,children,prop,state,onClick} from './hooks'
import {styleStringToObj as s} from './style-string-to-obj'
import data from './sample_data/ml_output_foo.json';
import {plog,pipe,get,oo} from './utils';

export const App = props=>
  <div className="App">
    <header className="App-header" style={s`bg077`}>
      <svg style={s`w100 h200px`}>
        <rect {...s`w100 h100 fillFFF`}/>
        <text style={{fill:'#000',transform:'translateY(20%)'}}>{JSON.stringify(data)}</text>
      </svg>
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <AdamExperiment2/>
    </header>
  </div>;




const AdamExperiment1 = Div(' AdamExperiment1... ');

const AdamExperiment2 = Div(
  state('rabbits','more',2),
  children(
    AdamExperiment1('Random Text'),
    p=>Div(`Rabbits:${p.rabbits}`,style('bg4BB')),
    p=>Button('More Rabbits!',onClick(p.more,fn=>fn(p.rabbits*2))),
  ),
  style('w200px h200px bg299 t80 lh140'),
  oo('more') // oo = "Omit to Object"
)

export default App;
/* eslint-enable no-unused-vars */
