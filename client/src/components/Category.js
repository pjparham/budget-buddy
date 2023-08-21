import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import CategoryCard from './CategoryCard'
import Navbar from './Navbar'
import Loading from './Loading'
import BudgetTable from './BudgetTable'
import { Heading, 
         Text, 
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
         SimpleGrid
         } from '@chakra-ui/react'
import { IoMdAdd } from 'react-icons/io'
import { BiArrowBack } from 'react-icons/bi'

const Category = ({  user, setUser }) => {
    const { id } = useParams()
    const [expenseForm, setExpenseForm] = useState({
      "title": "",
      "amount": "",
      "category_id": id,
    })
    const [category, setCategory] = useState()
    const toast = useToast()
    const navigate = useNavigate()

    function handleExpenseFormChange(e){
      setExpenseForm({
        ...expenseForm,
        [e.target.name]: e.target.value,
      })
    }

    function handleDeleteCategoryCard(deletedCategory){
      fetch(`/api/categories/${deletedCategory.id}`, {
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
       fetch('/api/expenses', {
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

      function patchCategory(patchedCategory){
        fetch(`/api/categories/${id}`, {
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
              title: 'Updated category',
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
        fetch(`/api/categories/${id}`)
        .then(res => res.json())
        .then(category => {
            setCategory(category)
        })
    }, [id])

  if (!category){
    return (
      <>
        <Navbar />
        <Loading />
      </>
    )
  }


  return (
    <>
        <Navbar setUser={setUser} user={user}/>
        <Box alignItems='flex-start' justifyContent='flex-start'>
          <Link to={`/budgets/${category.budget_id}`}>
            <Button leftIcon={<BiArrowBack/>} mt='6' rounded='full' 
                colorScheme='green' size='md' bg='green.400' mb='4'>
              Back To Budget
            </Button>
          </Link>
        </Box>
        {/* <Flex justifyContent='center' flexWrap='wrap'> */}
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' 
                justifyContent={"center"}
                display={"flex"}
                flexWrap={"wrap"}
                mb={'4'}>
              {/* <Box flex='65%' pr='4' maxWidth='33%' mb='4'> */}
                <CategoryCard fromBudget={false} key={category.id} category={category} handleDeleteCategoryCard={handleDeleteCategoryCard} editCategory={patchCategory} />
              {/* </Box> */}
            {/* <Box flex='30%' maxWidth='30%'> */}
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
            {/* </Box> */}
        {/* </Flex> */}
        </SimpleGrid>
        <br/>
        <BudgetTable fromBudget={false} transactions={category.expenses}/>
    </>
  )
}

export default Category