import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import CategoryCard from './CategoryCard'
import Navbar from './Navbar'
import BudgetTable from './BudgetTable'
import { Heading, Text, Container } from '@chakra-ui/react'

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
  if (!category){
    return (
      <>
        <Navbar />
        <Heading
            as={motion.h1}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
            mb={'25'}
            lineHeight={'110%'}>
        <Text as={'span'} 
            bgGradient="linear(to-r, green.400,green.700)"
            bgClip="text"
            >
        <br />
        Loading...
        </Text>
    </Heading>
      </>
    )
  }
  return (
    <>
        <Navbar />
        <br />
        <Container padding="10px" alignItems="center">
          <CategoryCard fromBudget={false} key={category.id} category={category} />
        </Container>
        
        <br/>
        <BudgetTable fromBudget={false} transactions={category.expenses}/>
        {}
    </>
  )
}

export default Category