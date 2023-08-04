
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

export default function BudgetTable( {transactions }) {
  return (
    <> 
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Date</Th>
              <Th >Amount</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
              {transactions?.map(transaction => { return (
            <Tr key={transaction.title}>
              <Td>{transaction.title}</Td>
              <Td>{transaction.created_at}</Td>
              <Td color={transaction.category_id ? "red.600" : "green.700"}>{transaction.amount}</Td>
              <Td><IconButton
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
