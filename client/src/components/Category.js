import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { useParams } from 'react-router-dom'

const Category = ({ category }) => {
    const { id } = useParams()

    useEffect(() => { 
        fetch(`/categories/${id}`)
        .then(res => res.json())
        .then(category => {
            console.log(category)
        })
    }, [])


  return (
    <>
        <Navbar />
        {}
    </>
  )
}

export default Category