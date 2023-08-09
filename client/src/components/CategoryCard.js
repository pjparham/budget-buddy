import React from 'react'
import { Card,
         CardHeader,
         Heading,
         CardBody,
         CardFooter,
         Text,
         Button,
         Progress
        } from '@chakra-ui/react' 
import { GiTakeMyMoney } from 'react-icons/gi'

const CategoryCard = ({ category, totalIncome }) => {
  return (
        <>
            <Card className='budget'>
                <div className='progress-text'>
                        <Heading size='md'>{category.title}</Heading>
                        <Text>${totalIncome} Budgeted</Text>
                </div>
                    <CardBody>
                        <Progress  hasStripe max={totalIncome} value={category.amount}></Progress>
                    </CardBody>
                    <div className="progress-text">
                        <small>${category.amount} spent</small>
                        <small>${totalIncome - category.amount} remaining</small>
                    </div>
                    <CardFooter justifyContent={'center'}>
                        <Button colorScheme='green' size='sm' leftIcon={<GiTakeMyMoney />}>View Details</Button>
                    </CardFooter>
            </Card>
        </>
  )
}

export default CategoryCard