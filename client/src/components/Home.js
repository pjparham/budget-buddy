import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  useDisclosure,
  Collapse,
  Card,
  CardHeader,
  CardBody,
  StackDivider,
  Input,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'
import { useState, useRef } from 'react'
import Navbar from './Navbar'
import { BiMoneyWithdraw } from 'react-icons/bi'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react'
import budgetLoading from '../lottie/BudgetAnimation.json'

export default function Home({ setUser, user }) {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState('')
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()
    const cancelRef = useRef()
    
    function budgetLink(budId){
      navigate(`/budgets/${budId}`)
    }

    function handleCreateBudget(e){
      e.preventDefault()
      fetch('/budgets', {
        method: "POST",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({ title: input })
      })
      .then((r) => {
        if(r.ok){
          r.json()
          .then((newBudget) => {
            setUser({...user, budgets: [...user.budgets, newBudget]})
          })
          setInput('')
          toast({
            title: `Created ${input} budget`,
            status: "success",
            position: "bottom",
            isClosable: true,
          })
        } else {
          r.json().then(e => console.log(e))
        }
      })
    }

    function handleDeleteBudget(budgetId){
      fetch(`/budgets/${budgetId}`, {
        method: "DELETE"
      })
      .then(() => {
        const updatedBudgets = user.budgets.filter((budget) => budget.id !== budgetId)
        setUser({...user, budgets: updatedBudgets})
        toast({
          title: 'Deleted Budget',
          status: "error",
          position: "top",
          isClosable: true,
        })
        onClose()
      })
    }

    if (!user) return <Lottie loop={true} animationData={budgetLoading}/>

  return (
    <>
    <Navbar setUser={setUser} user={user}/>
      <Container maxW={'1xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Heading
            as={motion.h1}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
            lineHeight={'110%'}>
            Welcome Back <br />
            <Text as={'span'} 
            bgGradient="linear(to-r, green.400,green.700)"
            bgClip="text">
              {user?.name}
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            Create a budget to get started
          </Text>
          <Stack
            direction={'column'}
            spacing={2}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <Button 
                    as={motion.button}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setOpen(!open)}
                    colorScheme={'green'}
                    bg={'green.400'}
                    rounded={'full'}
                    px={6}
                    _hover={{
                      bg: 'green.500',
                    }}>Create Your Budget</Button>
                <Collapse in={open} animateOpacity>
                    <Box
                    p='40px'
                    color='gray.500'
                    mt='4'
                    bg='white.500'
                    rounded='md'
                    shadow='md'
                    >
                      <Card>
                <CardHeader>
                    <Heading size='md'>Create Budget</Heading>
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleCreateBudget}>
                    <Stack divider={<StackDivider />} spacing={4}>
                    <Box>
                        <Heading size='xs' textTransform='uppercase'>
                        Budget Name
                        </Heading>
                        <br />
                        <Input
                          type='text'
                          value={input}
                          placeholder='name'
                          onChange={(e) => setInput(e.target.value)}
                          isRequired
                          />
                    </Box>
                    <Button
                    type='submit'
                    leftIcon={<BiMoneyWithdraw />}
                    colorScheme={'green'}
                    bg={'green.400'}
                    rounded={'full'}
                    px={6}
                    bgGradient="linear(to-r, green.400,green.700)"
                    color={'white'}
                    _hover={{
                      bgGradient: 'linear(to-r, green.400,green.800)',
                      boxShadow: 'xl'
                    }}>Create Budget</Button>
                    </Stack>
                    </form>
                </CardBody>
                </Card>
                    </Box>
                </Collapse>
          </Stack>
        </Stack>
      </Container>

      {user && user.budgets?.length > 0 ?
      <Container maxW={'xl'}>
      <Box
          p='40px'
          color='gray.500'
          mt='4'
          bg='white.500'
          rounded='md'
          shadow='md'
          >
            <Heading size='xl'>Your Budgets</Heading>
            <br />
              {user?.budgets.map(bud => (
              <Stack spacing='4'>
                  <Card variant='outline' key={bud.id}>
                    <CardHeader>
                      <Heading size='md'>{bud?.title}</Heading>
                    </CardHeader>
                    <CardBody>
                    <Stack spacing={6} direction={['column', 'row']}
                           justifyContent={"center"}
                           >
                    <Button colorScheme='green'
                          bg={'green.400'}
                          rounded={'full'}
                          onClick={() => budgetLink(bud.id)}
                          >View Details</Button>
                    <Button colorScheme='red'
                          bg={'red.400'}
                          rounded={'full'}
                          onClick={onOpen}
                          >Delete Budget</Button>
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
                              <Button colorScheme='red' onClick={() => handleDeleteBudget(bud.id)} ml={3}>
                                Delete
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialogOverlay>
                      </AlertDialog>
                    </Stack>
                    </CardBody>
                  </Card>
                  <br />
              </Stack>
              ))}
          </Box>
          </Container> 
        : null}      
    </>
  )
}