import { useState, useEffect } from 'react';
import { 
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton, } from '@chakra-ui/react'
import { BsTrash3Fill } from 'react-icons/bs'

export default function BudgetTable({ transactions, handleDeleteExpense, handleDeleteIncome, toast, categories }) {
  const [sortedTransactions, setSortedTransactions] = useState([]);

  useEffect(() => {
    const sorted = transactions?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setSortedTransactions(sorted);
  }, [transactions]);

  

  function onDeleteTransaction(transaction){
    //this checks if it's income or expense
    if (transaction.category_id){  //expenses 
      console.log('this is an expense')
    } else{ //incomes
      // console.log(transaction)
      fetch(`/incomes/${transaction.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json"}
      })
      .then((r) => {
        if(r.ok){
          r.json()
          handleDeleteIncome(transaction)
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
  }

  console.log(transactions, categories)


  return (
    <> 
      <TableContainer>
        <Table variant='striped'>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Category</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
              {sortedTransactions?.map(transaction => { return (
              <Tr key={transaction.title}>
              <Td>{transaction.title}</Td>
              <Td>{transaction.created_at.slice(0, 16)}</Td>
              <Td color={transaction.category_id ? "red.600" : "green.700"}>{transaction.amount}</Td>
              {categories.map(category => { return ( <Td key={category.id}>{transaction.category_id === category.id ? category.title : null}</Td> )})}
              <Td><IconButton
                      colorScheme='red'
                      bg={'red.400'}
                      icon={<BsTrash3Fill />}
                      onClick={() => onDeleteTransaction(transaction)}
                      /></Td>
            </Tr>
              )}
          )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}
