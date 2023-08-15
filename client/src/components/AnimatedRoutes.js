import React, { useState, useEffect } from 'react'
import { useLocation, Routes, Route } from 'react-router-dom'
import Landing from './Landing'
import Home from './Home'
import Budget from './Budget'
import UserProfile from './UserProfile'
import Category from './Category'
import { AnimatePresence } from 'framer-motion'

function AnimatedRoutes() {
    const location = useLocation()
    const [user, setUser] = useState()

useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/check_session");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.log('Failed to fetch user data.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <AnimatePresence>
        <Routes location={location} key={location.pathname}>
            <Route exact path='/' element={<Landing setUser={setUser}/>}/>
            <Route exact path='/home' element={<Home setUser={setUser} user={user}/>}/>
            <Route exact path='/budgets/:id' element={<Budget  setUser={setUser} user={user}/>}/>
            <Route exact path='/categories/:id' element={<Category  setUser={setUser} user={user}/>}/>
            <Route exact path='/user/profile' element={<UserProfile setUser={setUser} user={user}/>}/>
        </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes