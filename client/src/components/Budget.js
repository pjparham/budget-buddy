import { motion, Reorder } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BudgetChart from './BudgetChart'
import BudgetTable from './BudgetTable'
import CategoryCard from './CategoryCard'
import Navbar from './Navbar'
import { Heading,
         Text,
         Card,
         CardHeader,
         CardBody,
         CardFooter,
         SimpleGrid,
         Button,
         Input,
         NumberInput,
         NumberInputField,
         NumberInputStepper,
         NumberIncrementStepper,
         NumberDecrementStepper,
         Select,
         useToast } from '@chakra-ui/react'

import { IoMdAdd } from 'react-icons/io'

const Budget = ({ setUser, user }) => {
  const { id } = useParams()
  const toast = useToast()

  const [budget, setBudget] = useState();
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [incomes, setIncomes] = useState([])
  const [remainingAmount, setRemainingAmount] = useState()
  const [items, setItems] = useState([0, 1, 2]);


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

  const [expenseForm, setExpenseForm] = useState({
    "title": "",
    "amount": "",
    "category_id": "",
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
    if (categories?.length > 0) {
      setExpenseForm({
        ...expenseForm,
        category_id: categories[0].id,
      });
    }
  }, [categories]);


  function handleExpenseFormChange(e){
    setExpenseForm({
      ...expenseForm,
      [e.target.name]: e.target.value,
    })
  }


  function handleDeleteExpense(deletedExpense){
    let allIncomes = transactions.filter((transaction) => !transaction.category_id)
    let allExpenses = transactions.filter((transaction) => transaction.category_id)
    console.log(allIncomes, allExpenses)
    let updatedExpenses = allExpenses.filter((expense) => expense.id !== deletedExpense.id)
    console.log(updatedExpenses, 'updated expenses')
    let updatedTransactions = [incomes, updatedExpenses]
    console.log(updatedTransactions)
    setTransactions(updatedTransactions)
  }

  function handleDeleteIncome(deletedIncome){
    let incomes = transactions.filter((transaction) => !transaction.category_id)
    let expenses = transactions.filter((transaction) => transaction.category_id)
    let updatedIncomes = incomes.filter((income) => income.id !== deletedIncome.id)
    let updatedTransactions =[expenses, updatedIncomes]
    setTransactions(updatedTransactions.flat())
    let newRemainingAmount = remainingAmount - deletedIncome.amount
    setRemainingAmount(newRemainingAmount)
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
      let allTransactions = [...transactions, newIncome]
      setTransactions(allTransactions)
    }

    function addExpense(newExpense){
      let allTransactions = [...transactions, newExpense]
      setTransactions(allTransactions)
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
          toast({
            title: "Category Created",
            status: "success",
            position: "top",
            isClosable: true,
          })
        } else {
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
          toast({
            title: "Income Created",
            status: "success",
            position: "top",
            isClosable: true,
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

    function postExpense(e){
      e.preventDefault()
      fetch('/expenses', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(expenseForm)
      })
      .then((r) => {
        if(r.ok){
          r.json()
          .then((newExpense) => addExpense(newExpense))
          setExpenseForm({
            "title": "",
            "amount": "",
            "category_id": categories[0].id
          })
          toast({
            title: "Expense Created",
            status: "success",
            position: "top",
            isClosable: true,
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
            mb={'25'}
            lineHeight={'110%'}>
        <Text as={'span'} 
            bgGradient="linear(to-r, green.400,green.700)"
            bgClip="text"
            >
        <br />
        {budget?.title} Overview
        </Text>
    </Heading>
    {categories?.length === 0 ? null : <BudgetChart setUser={setUser} user={user} budget={budget} categories={categories} progressBar={progressBar} transactions={transactions} remainingAmount={remainingAmount} incomes={incomes}/>}
    <Reorder.Group axis='x' values={items} onReorder={setItems}>
    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' 
                justifyContent={"center"}
                display={"flex"}
                flexWrap={"wrap"}
                mb={'4'}>
      <Reorder.Item key={items[0]} value={items[0]}>
        <Card>
          <CardHeader>
            <Heading size='md'>Add New Category</Heading>
          </CardHeader>
          <CardBody>
            <Text>Category Name</Text>
            <Input placeholder="e.g. Groceries" name="title" value={categoryForm.title} onChange={handleCategoryFormChange}/>
            <Text>Amount</Text>
            <NumberInput min={0}>
              <NumberInputField placeholder="e.g. 350" name="amount" value={categoryForm.amount} onChange={handleCategoryFormChange}/>
              <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
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
      <Reorder.Item key={items[1]} value={items[1]}>
        <Card>
          <CardHeader>
            <Heading size='md'>Add Income</Heading>
          </CardHeader>
          <CardBody>
            <Text>Income Name</Text>
            <Input placeholder="e.g. First Paycheck" name="title" value={incomeForm.title} onChange={handleIncomeFormChange} />
            <Text>Amount</Text>
            <NumberInput min={0}>
            <NumberInputField placeholder="e.g. 1000" name="amount" value={incomeForm.amount} onChange={handleIncomeFormChange}/>
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput> 
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
      <Reorder.Item key={items[2]} value={items[2]}>
      <Card>
        <CardHeader>
          <Heading size='md'>Add Expense</Heading>
        </CardHeader>
        <CardBody>
        <Text>Expense Name</Text>
          <Input placeholder="e.g. Coffee" name="title" value={expenseForm.title} onChange={handleExpenseFormChange}/>
          <Text>Amount</Text>
          <NumberInput min={0}>
          <NumberInputField name="amount" value={expenseForm.amount} onChange={handleExpenseFormChange}placeholder="e.g. 3.50" /> 
          <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
              </NumberInputStepper>
          </NumberInput> 
          {categories?.length === 0 ? <Text>Create Category First!</Text> : 
          <>
          <Text>Category</Text>
            <Select value={expenseForm.category_id} onChange={handleExpenseFormChange} name="category_id">
            {categories?.map(category => (<option key={category.id} value={category.id}>{category.title}</option>))}
          </Select>
          </>}
        </CardBody>
        <CardFooter justifyContent='center'>
          <Button colorScheme='green'
                  bg={'green.400'}
                  rounded={'full'}
                  leftIcon={<IoMdAdd/>}
                  onClick={postExpense}
                  >Add Expense</Button>
        </CardFooter>
      </Card>
      </Reorder.Item>
    </SimpleGrid>
    </Reorder.Group>
      {categories && categories.length > 0 ? (
        <>
          <Heading mb={'4'}
                   bgGradient="linear(to-r, green.400,green.700)"
                   bgClip="text">Existing Categories</Heading>
             <SimpleGrid spacing={4}
                  justifyContent={"center"}
                  display={"flex"}
                  flexWrap={"wrap"}
                  mb={'4'}>
                  {categories.map((category) => (
                    <CategoryCard fromBudget={true} key={category.id} category={category} />
                    ))}
              </SimpleGrid>
          </>
      ) : null}

    {transactions.length === 0 ? null : <BudgetTable fromBudget={true} transactions={transactions} handleDeleteExpense={handleDeleteExpense} handleDeleteIncome={handleDeleteIncome} toast={toast} categories={categories}/>}
    </>
  )
}

export default Budget