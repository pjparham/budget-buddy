import React, { useState, useRef } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  InputRightElement,
  InputGroup,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react'

export default function UserProfileEdit({ user, setUser }) {
  const [userForm, setUserForm] = useState({
    "name": user?.name,
    "email": user?.email,
    "password": user?.password
  })
  const [show, setShow] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const cancelRef = useRef()
  const toast = useToast()

  function handleChange(e){
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    })
  }

  function clearForm(){
    setUserForm({
      "name": "",
      "email": "",
      "password": ""
    })
  }

  function handleUpdateUser(e){
    e.preventDefault()
    fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userForm)
    })
    .then(res => {
      if (res.ok){
          res.json().then(setUser)
          toast({
            title: "User Info Updated!",
            status: "success",
            position: "top",
            isClosable: true,
          })
      } else {
        res.json().then(e =>
        toast({
          title: `${res.status} ${e.error}`,
          status: "error",
          position: "top",
          isClosable: true,
        })
        )
      }
    })
    }

  function handleDeleteUser(userId){
    fetch(`/api/users/${userId}`, {
      method: "DELETE"
    })
    .then(() => {
      toast({
        title: 'Deleted User',
        status: "error",
        position: "top",
        isClosable: true,
      })
      setUser(null)
      navigate('/')
    })
  } 

  return (
    <>
      <Navbar setUser={setUser} user={user}/>
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <FormLabel>User Icon</FormLabel>
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" src="https://www.svgrepo.com/show/5125/avatar.svg">
              </Avatar>
            </Center>
            <Center w="full">
              <Button w="full" bgColor="red.400"
                onClick={onOpen}
                _hover={{
                  bg: 'red.500',
                }}>Delete User</Button>
            </Center>
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}>
                <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Delete User
                  </AlertDialogHeader>
                  <AlertDialogBody>
                    Are you sure? You will lose all your data!
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button colorScheme='red' onClick={() => handleDeleteUser(user.id)} ml={3}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Stack>
        </FormControl>
        <form onSubmit={handleUpdateUser}>
        <FormControl id="userName" isRequired>
          <FormLabel>User name</FormLabel>
          <Input
            name='name'
            value={userForm.name}
            onChange={handleChange}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
           name='email'
           value={userForm.email}
           onChange={handleChange}
           _placeholder={{ color: 'gray.500' }}
           type="email"
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
          <Input
            name='password'
            value={userForm.password}
            onChange={handleChange}
            _placeholder={{ color: 'gray.500' }}
            type={show ? "text" : "password"}
            mb={4}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" bg={'black'} 
                    color={'white'}
                    _hover={{bg: 'gray.500'}}
                    onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
          </InputGroup>
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            onClick={clearForm}
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          <Button
            type='submit'
            bg={'blue.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'blue.500',
            }}>
            Submit
          </Button>
        </Stack>
        </form>
      </Stack>
    </Flex>
    </>
  )
}