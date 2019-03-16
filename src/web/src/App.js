import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Div,withStyles,withChildren} from './hooks'
import {styleStringToObj as s} from './style-string-to-obj'
import data from './sample_data/ml_output_foo.json';

console.log(`w100 h200px`, s`w100 h200px`);
// <text style={s`w50 h40px tc900`}>FOO</text>
export const App = (props)=>
  <div className="App" style={props.style}>
    <header className="App-header">


      <svg style={s`w100 h200px`}>
        <rect width='100%' height='100%' fill='#fff'/>
        <text style={{fill:'#000',transform:'translateY(20%)'}}>{JSON.stringify(data)}</text>
      </svg>
      <pre style={s`w50 h2e vaM bgCCC`}>{JSON.stringify(data)}</pre>
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <AdamExperiment/>
    </header>
  </div>;

const AdamExperiment = Div(
  withStyles('w200px h200px bg090'),
  withChildren('div',
    (props)=>({...props,data}),
    withStyles('w1 h1 m1 bg00F'),
  )
)
export default App;
