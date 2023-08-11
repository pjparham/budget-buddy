import { useState, useEffect } from 'react';
import { 
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  IconButton,
  useToast } from '@chakra-ui/react'
import { BsTrash3Fill } from 'react-icons/bs'

export default function BudgetTable({ fromBudget, transactions, handleDeleteExpense, handleDeleteIncome, categories }) {
  const toast = useToast()
  
  const [sortedTransactions, setSortedTransactions] = useState([]);

  useEffect(() => {
    const sorted = transactions?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setSortedTransactions(sorted);
  }, [transactions]);


  function onDeleteTransaction(transaction){
    //this checks if it's income or expense
    if (transaction.category_id){  //expenses 
      fetch(`/expenses/${transaction.id}`, 
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
      .then((r) => {
        if(r.ok){
          r.json()
          handleDeleteExpense(transaction)
          toast({
            title: "Expense Deleted",
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
    } else { //incomes
      fetch(`/incomes/${transaction.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
      .then((r) => {
        if(r.ok){
          r.json()
          handleDeleteIncome(transaction)
          toast({
            title: "Income Deleted",
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
  }


  function displayCategory(transaction){
    if(transaction?.category_id){
      let category = categories.filter((cat) => cat.id === transaction.category_id)
      return <Td>{category[0].title}</Td>
    }
    else{
      return <Td>Income</Td>
    }
  }

  return (
    <> 
      <TableContainer maxWidth="100%">
        <Table variant='striped'>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Date</Th>
              <Th>Amount</Th>
              {fromBudget ? <Th>Category</Th> : null}
              {fromBudget ? <Th></Th> : null}
            </Tr>
          </Thead>
          <Tbody>
              {sortedTransactions?.map(transaction => { return (
              <Tr key={transaction.title}>
              <Td>{transaction?.title}</Td>
              <Td>{transaction?.created_at?.slice(0, 16)}</Td>
              <Td color={transaction?.category_id ? "red.600" : "green.700"}>{transaction?.amount}</Td>
              {fromBudget ? displayCategory(transaction) : null}
              {fromBudget ? <Td><IconButton
                      colorScheme='red'
                      bg={'red.400'}
                      icon={<BsTrash3Fill />}
                      onClick={() => onDeleteTransaction(transaction)}
                      /></Td> : null}
            </Tr>
              )}
          )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}
