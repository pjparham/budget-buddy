import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Heading, Progress, Text } from '@chakra-ui/react'
import BudgetChart from './BudgetChart'
import BudgetTable from './BudgetTable'
import Navbar from './Navbar'
import { Card,
         CardHeader,
         CardBody,
         CardFooter,
         SimpleGrid,
         Button,
         Input, } from '@chakra-ui/react'
import { BsTrash3Fill } from 'react-icons/bs'
import { IoMdAdd } from 'react-icons/io'

const Budget = ({ setUser, user }) => {
  const [budget, setBudget] = useState();
  const [categories, setCategories] = useState();
  const [transactions, setTransactions] = useState([]);

  const { id } = useParams()

    useEffect(() => {
        fetch(`/budgets/${id}`)
        .then(res => res.json())
        .then(setBudget)
    }, [])

    useEffect(() => {
      if(budget) {
        updateCategories()
        updateTransactions()
      }
    }, [budget]);

    function updateCategories(){
      setCategories(budget.categories)
    }

    function updateTransactions() {
      if (categories) {
        let allTransactions = [];
        allTransactions.push(budget.incomes);
    
        categories.forEach((category) => {
          allTransactions.push(category.expenses);
        });
    
        setTransactions(allTransactions.flat());
      }
    }

    const totalTransactions = transactions?.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount;
    }, 0)

    console.log(categories)

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
    <BudgetChart budget={budget} categories={categories}/>
    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' 
                justifyContent={"center"}
                alignContent={"center"}
                display={"flex"}
                flexWrap={"wrap"}
                mb={'4'}>
        <Card>
          <CardHeader>
            <Heading size='md'>Total Spent</Heading>
          </CardHeader>
          <CardBody>
            <Progress value={totalTransactions} colorScheme='green' size='sm' mb={'2'} />
            <Text>{totalTransactions}</Text>
          </CardBody>
        <CardFooter>
          <Button colorScheme='red'
                  bg={'red.400'}
                  rounded={'full'}
                  leftIcon={<BsTrash3Fill/>}
                  >Delete Budget</Button>
        </CardFooter>
        </Card>
      <Card>
        <CardHeader>
          <Heading size='md'>Add New Category</Heading>
        </CardHeader>
        <CardBody>
          <Text>Category Name</Text>
          <Input placeholder="Expense Name" />
          <Text>Amount</Text>
          <Input placeholder="Amount" /> 
        </CardBody>
        <CardFooter justifyContent='center'>
        <Button colorScheme='green'
                  bg={'green.400'}
                  rounded={'full'}
                  leftIcon={<IoMdAdd/>}
                  >Add Category</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <Heading size='md'>Add Income</Heading>
        </CardHeader>
        <CardBody>
          <Text>Income Name</Text>
          <Input placeholder="Income Name" />
          <Text>Amount</Text>
          <Input placeholder="Amount" /> 
        </CardBody>
        <CardFooter justifyContent={'center'}>
          <Button colorScheme='green'
                  bg={'green.400'}
                  rounded={'full'}
                  leftIcon={<IoMdAdd/>}
                  >Add Income</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <Heading size='md'>Add Expense</Heading>
        </CardHeader>
        <CardBody>
        <Text>Expense Name</Text>
          <Input placeholder="Expense Name" />
          <Text>Amount</Text>
          <Input placeholder="Amount" /> 
        </CardBody>
        <CardFooter justifyContent={'center'}>
          <Button colorScheme='green'
                  bg={'green.400'}
                  rounded={'full'}
                  leftIcon={<IoMdAdd/>}
                  >Add Expense</Button>
        </CardFooter>
      </Card>
    </SimpleGrid>
  <BudgetTable transactions={transactions}/>

    </>
  )
}

export default Budget

{/*  */}