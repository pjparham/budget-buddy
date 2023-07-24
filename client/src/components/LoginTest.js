import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginTest({ setUser }) {
    const navigate = useNavigate()

    function handleLogout(e){
        e.preventDefault()
        fetch('logout',{
            method: "DELETE"
        }).then(() =>setUser(null))
        navigate('/')
    }

  return (
    <div>
        <div>LoginTest</div>
        <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
