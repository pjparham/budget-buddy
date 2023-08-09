import React, { useState, useEffect } from 'react'
import { useLocation, Routes, Route } from 'react-router-dom'
import Landing from './Landing'
import LoginTest from './LoginTest'
import Home from './Home'
import Budget from './Budget'
import UserProfile from './UserProfile'
import Category from './Category'
import { AnimatePresence } from 'framer-motion'

function AnimatedRoutes() {
    const location = useLocation()
    const [user, setUser] = useState()
    const [budgets, setBudgets] = useState([])

//   useEffect(() => {
//     fetch("/check_session")
//     .then((r) => r.json())
//     .then(res => {
//       if (res.ok){
//         console.log('res', res)
//         res.json().then(setUser)
//       } else{
//         console.log(res)
//       }
//     })    
//   }, [])

useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/check_session");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        //   setUser(userData.budgets)
        } else {
          console.log('Failed to fetch user data.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // console.log(user)

  return (
    <AnimatePresence>
        <Routes location={location} key={location.pathname}>
            <Route exact path='/' element={<Landing setUser={setUser}/>}/>
            <Route exact path='/login-test' element={<LoginTest setUser={setUser}/>}/>
            <Route exact path='/home' element={<Home setUser={setUser} user={user}/>}/>
            <Route exact path='/budgets/:id' element={<Budget setUser={setUser} user={user}/>}/>
            <Route exact path='/categories/:id' element={<Category setUser={setUser} user={user}/>}/>
            <Route exact path='/user/profile' element={<UserProfile setUser={setUser} user={user}/>}/>
        </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes