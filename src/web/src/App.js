import React, {creatElement as el, Component } from 'react';
import logo from './logo.svg';
import './App.css';
import data from '../../mobile/assets/sample_data/ml_output_foo.json';


export const App = ()=>
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer"> Learn React </a>
      <svg height="90%" width="100%">
        <text data-testid='data'>{JSON.stringify(data)}</text>
      </svg>
    </header>
  </div>;


export default App;
