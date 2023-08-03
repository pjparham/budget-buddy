import Navbar from './Navbar'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Budget = ({ setUser, user }) => {
    const [budget, setBudget] = useState()
    const { id } = useParams()

    useEffect(() => {
        fetch(`/budgets/${id}`)
        .then(res => res.json())
        .then(setBudget)
    }, [])

  return (
    <div>
    <Navbar setUser={setUser} user={user}/>
    {budget?.title}
    <h1>Budgy!</h1>
    </div>
  )
}

export default Budget