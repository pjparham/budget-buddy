import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './components/Landing.js';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <h1>Budget Buddy</h1>
      </header> */}
      <Landing />
    </div>
  );
}

export default App;
