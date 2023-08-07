import React, { useState } from 'react'
import Navbar from './Navbar'
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
  AvatarBadge,
  IconButton,
  Center,
  InputRightElement,
  InputGroup,
  useToast
} from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'

export default function UserProfileEdit({ user, setUser }) {
  const [userForm, setUserForm] = useState({
    "name": user?.name,
    "email": user?.email,
    "password": user?.password
  })
  const [show, setShow] = useState(false)
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
    fetch(`/users/${user.id}`, {
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
                <AvatarBadge
                  as={IconButton}
                  size="sm"
                  rounded="full"
                  top="-10px"
                  colorScheme="red"
                  aria-label="remove Image"
                  icon={<SmallCloseIcon />}
                />
              </Avatar>
            </Center>
            <Center w="full">
              <Button w="full">Change Icon</Button>
            </Center>
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