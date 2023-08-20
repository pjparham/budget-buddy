import {
    Box,
    Stack,
    Heading,
    Text,
    Input,
    Button,
    InputRightElement,
    InputGroup,
    useToast
  } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BsPersonHeart } from 'react-icons/bs';

export default function Signup({handleChange, userForm, setIsLogin, setUser}) {
    const [show, setShow] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()

    function handleChangeForm(){
        setIsLogin(true)
    }

    function handleSignup(e){
      e.preventDefault() 
      fetch(`/api/users`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userForm)
      })
      .then(res => {
      if (res.ok){
        res.json().then(setUser)
        console.log('success')
        return navigate("/home")
       } else {
        res.json().then(e =>
          toast({
            title: `${res.status} ${e.error} error`,
            status: "error",
            position: "top",
            isClosable: true,
          })
        )
        }
      })
    }

  return (
    <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}>
    <Stack
    bg={'gray.50'}
    // bg={'red'}
    rounded={'xl'}
    p={{ base: 4, sm: 6, md: 8 }}
    spacing={{ base: 8 }}
    maxW={{ lg: 'lg' }}
    >
    <Stack spacing={4}>
      <Heading
        color={'gray.800'}
        lineHeight={1.1}
        fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
        Sign up for Budget Buddy
        <Text
          as={'span'}
          bgGradient="linear(to-r, green.400,green.700)"
          bgClip="text">
          !
        </Text>
      </Heading>
      <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
      Budget Buddy is a user-friendly application designed to help individuals manage their personal finances effectively. 
      With a focus on simplicity and convenience, the app enables users to track their income, expenses, and savings in real-time.
      </Text>
    </Stack>
    <Box as="form" mt={10}>
      <Stack spacing={4}>
        <Input
          placeholder="Name"
          bg={'gray.100'}
          border={0}
          color={'gray.800'}
          name='name'
          value={userForm.name}
          onChange={handleChange}
          _placeholder={{
            color: 'gray.500',
          }}
        />
        <Input
          placeholder="firstname@lastname.io"
          bg={'gray.100'}
          border={0}
          color={'gray.800'}
          name='email'
          value={userForm.email}
          onChange={handleChange}
          _placeholder={{
            color: 'gray.500',
          }}
          
        />
        <InputGroup>
        <Input
          placeholder="Password"
          type={show ? "text" : "password"}
          bg={'gray.100'}
          border={0}
          color={'gray.800'}
          name='password'
          value={userForm.password}
          onChange={handleChange}
          _placeholder={{
            color: 'gray.500',
          }}
        />
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm'
          bg={'black'} 
          color={'white'}
          _hover={{bg: 'gray.500'}} 
          onClick={() => setShow(!show)}>
            {show ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
        </InputGroup>
      </Stack>
      <Button
        onClick={handleSignup}
        type='submit'
        leftIcon={<BsPersonHeart />}
        fontFamily={'heading'}
        mt={8}
        w={'full'}
        bgGradient="linear(to-r, green.400,green.700)"
        color={'white'}
        _hover={{
          bgGradient: 'linear(to-r, green.400,green.800)',
          boxShadow: 'xl',
        }}>
        Create
      </Button>
     <Text color={'gray.600'}>Already have an account? Log in</Text> 
     <Text as="span" cursor="pointer" fontWeight="600" onClick={handleChangeForm} color={'gray.500'}>here</Text>
    </Box>
  </Stack>
  </motion.div>
  )
}
