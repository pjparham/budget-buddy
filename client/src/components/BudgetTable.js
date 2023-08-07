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

export default function BudgetTable( { transactions }) {
  const [sortedTransactions, setSortedTransactions] = useState([]);

  useEffect(() => {
    const sorted = [...transactions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setSortedTransactions(sorted);
  }, [transactions]);

  // console.log(sortedTransactions)

  return (
    <> 
      <TableContainer>
        <Table variant='striped'>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Date</Th>
              <Th >Amount</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
              {sortedTransactions?.map(transaction => { return (
            <Tr key={transaction.title}>
              <Td>{transaction.title}</Td>
              <Td>{transaction.created_at}</Td>
              <Td color={transaction.category_id ? "red.600" : "green.700"}>{transaction.amount}</Td>
              <Td><IconButton
                      colorScheme='red'
                      bg={'red.400'}
                      icon={<BsTrash3Fill />}
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
