import React from 'react'
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
         Button } from '@chakra-ui/react'
import { BsTrash3Fill } from 'react-icons/bs'

export default function BudgetChart({ budget, categories, progressBar, transactions, incomes, remainingAmount }) {
    const data = [["Category", "Amount Allocated"]];

    const totalExpenses = categories?.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.amount;
      }, 0)

    if(budget && categories){
        data.push(["Remaining Amount", budget.remaining_amount])
        categories.forEach((cat) => {
            data.push([cat.title, cat.amount])
        })
    }
      
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
                      >Delete Budget</Button>
            </CardFooter>
          </Card>
    </Container>
  ) : <><br/><h1>Loading...</h1></>;
}
