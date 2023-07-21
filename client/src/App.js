import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './components/Landing.js';
import './App.css';

function App() {
  const [user, setUser] = useState([])
  

  useEffect(() => {
    fetch("/check_session")
    .then((r) => r.json())
    .then((user) => setUser(user))    
  }, [])



  return (
    <div className="App">
      <Landing />
    </div>
  );
}

export default App;
