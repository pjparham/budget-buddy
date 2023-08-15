import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import CategoryCard from './CategoryCard'
import Navbar from './Navbar'
import BudgetTable from './BudgetTable'
import { Heading, 
         Text, 
         Flex,
         Box,
         Input,
         Card,
         CardHeader,
         CardBody,
         Button,
         NumberDecrementStepper,
         NumberIncrementStepper,
         NumberInputStepper,
         NumberInput,
         NumberInputField,
         useToast,
         } from '@chakra-ui/react'
import { IoMdAdd } from 'react-icons/io'
import { BiArrowBack } from 'react-icons/bi'

const Category = ({  user, setUser }) => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [expenseForm, setExpenseForm] = useState({
      "title": "",
      "amount": "",
      "category_id": id,
    })
    const [category, setCategory] = useState()
    const toast = useToast()

    function handleExpenseFormChange(e){
      setExpenseForm({
        ...expenseForm,
        [e.target.name]: e.target.value,
      })
    }

    function handleDeleteCategoryCard(deletedCategory){
      fetch(`/categories/${deletedCategory.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
      .then((r) => {
        if(r.ok){
          r.json()
          .then((deletedCategory) => {
            setUser({...user, categories: user.categories?.filter((category) => category.id !== deletedCategory.id)})
          })
          navigate(`/budgets/${deletedCategory.budget_id}`)
          toast({
            title: `Deleted ${deletedCategory.title} category`,
            status: "success",
            position: "bottom",
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

    function postExpense(e){
       e.preventDefault()
       fetch('/expenses', {
          method: "POST",
          headers: {"Content-Type": 'application/json'},
          body: JSON.stringify(expenseForm)
       })
       .then((r) => {
          if(r.ok){
            r.json()
            .then((newExpense) => {
              setCategory({...category, expenses: [...category.expenses, newExpense]})
            })
            setExpenseForm({
              "title": "",
              "amount": 0,
              "category_id": id
            })
            toast({
              title: 'Created expense',
              status: "success",
              position: "bottom",
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

      function patchCategoryTitle(patchedCategory){
        fetch(`/categories/${id}`, {
          method: "PATCH",
          headers: {"Content-Type": 'application/json'},
          body: JSON.stringify(patchedCategory)
        })
        .then((r) => {
          if(r.ok){
            r.json()
            .then((updatedCategory) => {
              setCategory(updatedCategory)
            })
            toast({
              title: 'Updated category title',
              status: "success",
              position: "bottom",
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

      function patchCategoryAmount(patchedCategory){
        fetch(`/categories/${id}`, {
          method: "PATCH",
          headers: {"Content-Type": 'application/json'},
          body: JSON.stringify(patchedCategory)
        })
        .then((r) => {
          if(r.ok){
            r.json()
            .then((updatedCategory) => {
              setCategory(updatedCategory)
            })
            toast({
              title: 'Updated category amount',
              status: "success",
              position: "bottom",
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

    useEffect(() => { 
        fetch(`/categories/${id}`)
        .then(res => res.json())
        .then(category => {
            setCategory(category)
        })
    }, [id])

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
        <Navbar setUser={setUser} user={user}/>
        <Box alignItems='flex-start' justifyContent='flex-start'>
        <Button leftIcon={<BiArrowBack/>} mt='6' rounded='full' colorScheme='green' size='md' bg='green.400' mb='4'
                onClick={() => navigate(`/budgets/${category.budget_id}`)}>Back To Budget</Button>
        </Box>
        <Flex justifyContent='center' flexWrap='wrap'>
              <Box flex='65%' pr='4' maxWidth='33%' mb='4'>
                <CategoryCard fromBudget={false} key={category.id} category={category} handleDeleteCategoryCard={handleDeleteCategoryCard} editTitle={patchCategoryTitle} editAmount={patchCategoryAmount}/>
              </Box>
            <Box flex='30%' maxWidth='30%'>
            <Card>
                <CardHeader>
                  <Heading size='lg'>Add Expense</Heading>
                </CardHeader>
                <CardBody>
                    <Text>Expense Name</Text>
                    <Input name='title' placeholder='e.g. Coffee'  onChange={handleExpenseFormChange}/>
                    <Text>Amount</Text>
                    <NumberInput defaultValue={1} min={1} max={100} mb={'4'}>
                    <NumberInputField name="amount" placeholder="e.g. 3.50"  onChange={handleExpenseFormChange}/> 
                      <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <Button colorScheme='green' size='md'
                        bg={'green.400'}
                        rounded={'full'} 
                        leftIcon={<IoMdAdd />}
                        onClick={postExpense}>Add Expense</Button>
                </CardBody>
            </Card>
            </Box>
        </Flex>
        <br/>
        <BudgetTable fromBudget={false} transactions={category.expenses}/>
    </>
  )
}

export default Category