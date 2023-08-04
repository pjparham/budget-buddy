import Navbar from './Navbar'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Heading, 
        Text,
        Table,
        Thead,
        Tbody,
        Tr,
        Th,
        Td,
        TableContainer,
        IconButton, } from '@chakra-ui/react'
import { BsTrash3Fill } from 'react-icons/bs'
import { Chart } from 'react-google-charts'

const Budget = ({ setUser, user }) => {
    const [budget, setBudget] = useState()
    const { id } = useParams()

    useEffect(() => {
        fetch(`/budgets/${id}`)
        .then(res => res.json())
        .then(setBudget)
    }, [])

    console.log(budget)

    const data = [
        ["Task", "Hours per Day"],
        ["Work", 11],
        ["Eat", 2],
        ["Commute", 2],
        ["Watch TV", 2],
        ["Sleep", 7],
      ];
      
    const options = {
        title: "My Daily Activities",
        backgroundColor: "transparent",
        is3D: true,
        titleTextStyle: {
            color: '#B2BEB5'
        },
        legendTextStyle: {
            color: '#B2BEB5'
        },
      }

    const renderCat = budget?.categories.map(cat => cat.title)
    const renderAmt = budget?.categories.map(cat => cat.amount)


  return (
    <>
    <Navbar setUser={setUser} user={user}/>
        <Heading
            as={motion.h1}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
            lineHeight={'110%'}>
        <Text as={'span'} 
            bgGradient="linear(to-r, green.400,green.700)"
            bgClip="text">
        <br />
        {budget?.title} Overview
        </Text>
    </Heading>
        <Chart
            chartType="PieChart"
            data={data}
            options={options}
            width="100%"
            height="400px"
            />
        <br />
        <br />
    <TableContainer>
  <Table variant='simple'>
    <Thead>
      <Tr>
        <Th>Name</Th>
        <Th>Date</Th>
        <Th >Amount</Th>
        <Th></Th>
      </Tr>
    </Thead>
    <Tbody>
        {budget?.categories.map(cat => { (
      <Tr>
        <Td>{cat.title}</Td>
        <Td>{cat.created_at}</Td>
        <Td >{cat.amount}</Td>
        <Td><IconButton
                icon={<BsTrash3Fill />}
                /></Td>
    </Tr>
        )}
    )}
    </Tbody>
  </Table>
</TableContainer>
    </>
  )
}

export default Budget