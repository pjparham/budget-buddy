import { motion, Reorder } from 'framer-motion'
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
  const [items, setItems] = useState([0, 1, 2, 3]);

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

    const totalExpenses = categories?.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount;
    }, 0)

    const totalIncome = budget?.incomes.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount;
    }, 0)

    const progressBar = 100 - (budget?.remaining_amount / totalIncome) * 100

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
    <Reorder.Group axis='x' values={items} onReorder={setItems}>
    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' 
                justifyContent={"center"}
                display={"flex"}
                mb={'4'}>
        <Reorder.Item key={items[0]} value={setItems}>
        <Card>
          <CardHeader>
            <Heading size='md'>Total Spent</Heading>
            <Text>${totalExpenses}</Text>
          </CardHeader>
          <CardBody>
            <Progress hasStripe value={progressBar} colorScheme='green' size='sm' mb={'2'} />
            <Text>Remaining: ${budget?.remaining_amount}</Text>
          </CardBody>
        <CardFooter>
          <Button colorScheme='red'
                  bg={'red.400'}
                  rounded={'full'}
                  leftIcon={<BsTrash3Fill/>}
                  >Delete Budget</Button>
        </CardFooter>
        </Card>
      </Reorder.Item>
      <Reorder.Item key={items[1]} value={setItems}>
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
      </Reorder.Item>
      <Reorder.Item key={items[2]} value={setItems}>
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
      </Reorder.Item>
      <Reorder.Item key={items[3]} value={setItems}>
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
      </Reorder.Item>
    </SimpleGrid>
    </Reorder.Group>
  <BudgetTable transactions={transactions}/>

    </>
  )
}

export default Budget

{/*  */}