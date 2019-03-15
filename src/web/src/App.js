import React from 'react';
import logo from './logo.svg';
import './App.css';

import {Div,withStyles,withChildren} from './hooks'
import data from './sample_data/ml_output_foo.json';


const Div2 = Div(
  withStyles('w200px h200px bg090'),
  (props)=>({...props,data:[{key:'1'},{key:'2'}]}),
  withChildren('div','data',
    withStyles('w1 h1 m1 bg00F'),
  )
)

export const App = (props)=>
  <div className="App" style={props.style}>
    <header className="App-header">
    <Div2/>
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer"> Learn React </a>
      <svg height="90%" width="100%">
        <text>{JSON.stringify(data)}</text>
      </svg>
    </header>
  </div>;

export default App;
