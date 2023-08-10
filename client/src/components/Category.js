import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { useParams } from 'react-router-dom'

const Category = () => {
    const { id } = useParams()
    const [category, setCategory] = useState()


    useEffect(() => { 
        fetch(`/categories/${id}`)
        .then(res => res.json())
        .then(category => {
            setCategory(category)
        })
    }, [])

    console.log(category)
  return (
    <>
        <Navbar />
        {}
    </>
  )
}

export default Category