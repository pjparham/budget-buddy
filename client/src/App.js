import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './components/Landing.js';
import LoginTest from './components/LoginTest.js';
import './App.css';

function App() {
  const [user, setUser] = useState([])
  

  useEffect(() => {
    fetch("/check_session")
    .then((r) => r.json())
    .then(res => {
      if (res.ok){
        console.log('res', res)
        res.json().then(setUser)
      } else{
        console.log(res)
      }
    })    
  }, [])


  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Landing setUser={setUser}/>}/>
        <Route exact path='/login-test' element={<LoginTest setUser={setUser}/>}/>
      </Routes>
    </div>
  );
}

export default App;
