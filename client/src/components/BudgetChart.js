import React, { useRef } from 'react'
import { Chart } from 'react-google-charts'
import { Heading,
         Container,
         Card,
         CardHeader,
         Text,
         CardBody,
         Progress,
         CardFooter,
         SimpleGrid,
         Button,
         useToast,
         useDisclosure,
         AlertDialog,
         AlertDialogBody,
         AlertDialogFooter,
         AlertDialogHeader,
         AlertDialogContent,
         AlertDialogOverlay, } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { BsTrash3Fill } from 'react-icons/bs'

export default function BudgetChart({ setUser, user, budget, categories, progressBar, transactions, incomes, remainingAmount }) {
    const data = [["Category", "Amount Allocated"]];
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()
    const toast = useToast

    const totalExpenses = categories?.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.amount;
      }, 0)

    if(budget && categories){
        data.push(["Remaining Amount", remainingAmount])
        categories.forEach((cat) => {
            data.push([cat.title, cat.amount])
        })
    }
    // console.log(transactions)
      
    const options = {
        title: budget?.title || '',
        backgroundColor: "transparent",
        is3D: true,
        titleTextStyle: {
            color: '#B2BEB5'
        },
        legendTextStyle: {
            color: '#B2BEB5'
        },
      }

    function handleDeleteBudget(){
        fetch(`/api/budgets/${budget.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then((r) => {
            if(r.ok){
                r.json()
                const updatedBudgets = user.budgets.filter((b) => b.id !== budget.id)
                setUser({...user, budgets: updatedBudgets})
                navigate('/home')
            }
        })
    } 

  return budget && categories ? (
    <Container
        as={SimpleGrid}
        maxW={'6xl'}
        columns={'2'}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 15 }}>
        <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width="115%"
        height="400px"
        />
        <Card mb={'20'} maxW={'l'}>
          <CardHeader>
            <Heading size='md'>Total Spent</Heading>
            <Text>${totalExpenses}</Text>
          </CardHeader>
            <CardBody>
              <Progress hasStripe value={!transactions || !categories || !incomes ? 0 : progressBar} colorScheme='green' size='sm' mb={'2'} />
              <Text>Remaining: ${budget ? remainingAmount : null}</Text>
            </CardBody>
            <CardFooter justifyContent={'center'}>
              <Button colorScheme='red'
                      bg={'red.400'}
                      rounded={'full'}
                      leftIcon={<BsTrash3Fill/>}
                      onClick={onOpen}
                      >Delete Budget</Button>
            </CardFooter>
          </Card>
          <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}>
            <AlertDialogOverlay>
              <AlertDialogContent>
                  <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Delete Budget
                  </AlertDialogHeader>
                  <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                  </AlertDialogBody>
                  <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme='red' onClick={handleDeleteBudget} ml={3}>
                    Delete
                  </Button>
                  </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
    </Container>
  ) : <><br/><h1>Loading...</h1></>;
}
