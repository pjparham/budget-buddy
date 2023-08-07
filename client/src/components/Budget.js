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
         Input,
         useToast } from '@chakra-ui/react'
import { BsTrash3Fill } from 'react-icons/bs'
import { IoMdAdd } from 'react-icons/io'

const Budget = ({ setUser, user }) => {
  const { id } = useParams()
  const toast = useToast()

  const [budget, setBudget] = useState();
  const [categories, setCategories] = useState();
  const [transactions, setTransactions] = useState([]);
  const [incomes, setIncomes] = useState([])
  const [remainingAmount, setRemainingAmount] = useState()
  const [items, setItems] = useState([0, 1, 2, 3]);


  //state for forms
  const [categoryForm, setCategoryForm] = useState({
    "title": "",
    "amount": "",
    "budget_id": id
  })

  const [incomeForm, setIncomeForm] = useState({
    "title": "",
    "amount": "",
    "budget_id": id
  })

  // change functions for forms
  function handleCategoryFormChange(e){
    setCategoryForm({
      ...categoryForm,
      [e.target.name]: e.target.value,
    })
  }

  function handleIncomeFormChange(e){
    setIncomeForm({
      ...incomeForm,
      [e.target.name]: e.target.value,
    })
  }

    useEffect(() => {
        fetch(`/budgets/${id}`)
        .then(res => res.json())
        .then(setBudget)
    }, [])

    useEffect(() => {
      if(budget) {
        updateCategories()
        updateTransactions()
        updateIncomes()
        setRemainingAmount(budget.remaining_amount)
      }
    }, [budget]);

    function updateCategories(){
      setCategories(budget.categories)
    }

    function updateIncomes(){
      setIncomes(budget.incomes)
    }

    function addCategory(newCategory){
      let allCategories = [...categories, newCategory]
      setCategories(allCategories)
      let newRemainingAmount = remainingAmount - newCategory.amount
      setRemainingAmount(newRemainingAmount)
    }

    function addIncome(newIncome){
      let allIncomes = [...incomes, newIncome]
      setIncomes(allIncomes)
      let newRemainingAmount = remainingAmount + newIncome.amount
      setRemainingAmount(newRemainingAmount)
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

    function postCategory(e){
      e.preventDefault()
      fetch('/categories', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(categoryForm)
      })
      .then((r) => {
        if(r.ok){
          r.json()
          .then((newCategory) => addCategory(newCategory))
          setCategoryForm({
            "title": "",
            "amount": "",
            "budget_id": id
          })
        } else{
          r.json().then(e =>
            toast({
              title: `${r.status} ${e.error}`,
              status: "error",
              position: "top",
              isClosable: true,
            })
            )
        }
      })
    }

    function postIncome(e){
      e.preventDefault()
      fetch('/incomes', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(incomeForm)
      })
      .then((r) => {
        if(r.ok){
          r.json()
          .then((newIncome) => addIncome(newIncome))
          setIncomeForm({
            "title": "",
            "amount": "",
            "budget_id": id
          })
        } else{
          r.json().then(e =>
            toast({
              title: `${r.status} ${e.error}`,
              status: "error",
              position: "top",
              isClosable: true,
            })
            )
        }
      })
    }

    const totalExpenses = categories?.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount;
    }, 0)

    const totalIncome = incomes?.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount;
    }, 0)

    const progressBar = 100 - (remainingAmount / totalIncome) * 100

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
                flexWrap={"wrap"}
                mb={'4'}>
      <Reorder.Item key={items[0]} value={items[0]}>
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
      <Reorder.Item key={items[1]} value={items[1]}>
        <Card>
          <CardHeader>
            <Heading size='md'>Add New Category</Heading>
          </CardHeader>
          <CardBody>
            <Text>Category Name</Text>
            <Input placeholder="e.g. Groceries" name="title" value={categoryForm.title} onChange={handleCategoryFormChange}/>
            <Text>Amount</Text>
            <Input placeholder="e.g. 350" name="amount" value={categoryForm.amount} onChange={handleCategoryFormChange}/> 
          </CardBody>
          <CardFooter justifyContent='center'>
          <Button colorScheme='green'
                    bg={'green.400'}
                    rounded={'full'}
                    leftIcon={<IoMdAdd/>}
                    onClick={postCategory}
                    >Add Category</Button>
          </CardFooter>
        </Card>
      </Reorder.Item>
      <Reorder.Item key={items[2]} value={items[2]}>
        <Card>
          <CardHeader>
            <Heading size='md'>Add Income</Heading>
          </CardHeader>
          <CardBody>
            <Text>Income Name</Text>
            <Input placeholder="e.g. First Paycheck" name="title" value={incomeForm.title} onChange={handleIncomeFormChange} />
            <Text>Amount</Text>
            <Input placeholder="e.g. 1000" name="amount" value={incomeForm.amount} onChange={handleIncomeFormChange}/> 
          </CardBody>
          <CardFooter justifyContent='center'>
            <Button colorScheme='green'
                    bg={'green.400'}
                    rounded={'full'}
                    leftIcon={<IoMdAdd/>}
                    onClick={postIncome}
                    >Add Income</Button>
          </CardFooter>
        </Card>
      </Reorder.Item>
      <Reorder.Item key={items[3]} value={items[3]}>
      <Card>
        <CardHeader>
          <Heading size='md'>Add Expense</Heading>
        </CardHeader>
        <CardBody>
        <Text>Expense Name</Text>
          <Input placeholder="e.g. Coffee" />
          <Text>Amount</Text>
          <Input placeholder="e.g. 3.50" /> 
        </CardBody>
        <CardFooter justifyContent='center'>
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