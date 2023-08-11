import React from 'react'
import { Card,
         Heading,
         CardBody,
         CardFooter,
         Text,
         Button,
         Progress
        } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom' 
import { GiTakeMyMoney } from 'react-icons/gi'

const CategoryCard = ({ category, fromBudget }) => {
    const navigate = useNavigate()
    //initates accumulator for total spent
    let totalSpent = 0
    if(category){
        //adds amount of each expense to total spent accumulator
        category.expenses.forEach((expense) => totalSpent += expense.amount) //adds amount of each expense to total spent acculumater
    }

    function categoryLink(catId){
        navigate(`/categories/${catId}`)
      }
    console.log(category.title, totalSpent, fromBudget)

  return (
        <>
            <Card className='budget'>
                <div className='progress-text'>
                        <Heading size='md'>{category.title}</Heading>
                        <Text>${category.amount} Budgeted</Text>
                </div>
                <CardBody>
                    <Progress colorScheme='green' hasStripe max={category.amount} value={totalSpent}></Progress>
                </CardBody>
                <div className="progress-text">
                    <small>${totalSpent} spent</small>
                    <small>${category.amount - totalSpent} remaining</small>
                </div>
                <CardFooter justifyContent={'center'}>
                    {fromBudget ? <Button colorScheme='green' size='sm' leftIcon={<GiTakeMyMoney />}
                        onClick={() => categoryLink(category.id)}>View Details</Button> : null}
                </CardFooter>
            </Card>
        </>
  )
}

export default CategoryCard