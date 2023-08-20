import {
    Box,
    Stack,
    Heading,
    Text,
    Input,
    Button,
    useToast,
    InputGroup,
    InputRightElement,
  } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BsPersonHearts } from 'react-icons/bs';

export default function Login({handleChange, userForm, setIsLogin, setUser}) {
    const [show, setShow] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()
    function handleChangeForm(){
        setIsLogin(false)
    }

    function handleLogin(e){
        e.preventDefault()
        fetch(`/api/login`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userForm)
        })
        .then(res => {
            if (res.ok){
                res.json().then(setUser)
                return navigate("/home")
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
    <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}>
    <Stack
    bg={'gray.50'}
    rounded={'xl'}
    p={{ base: 4, sm: 6, md: 8 }}
    spacing={{ base: 8 }}
    maxW={{ lg: 'lg' }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    >
    <Stack spacing={4}>
      <Heading
        color={'gray.800'}
        lineHeight={1.1}
        fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
        Login to Budget Buddy
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
    <Box mt={10}>
      <form>
      <Stack spacing={4}>
        <Input
          isRequired
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
            isRequired
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
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" bg={'black'} 
                    color={'white'}
                    _hover={{bg: 'gray.500'}}
                    onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </Stack>
      <Button
        onClick={handleLogin}
        type='submit'
        leftIcon={<BsPersonHearts />}
        fontFamily={'heading'}
        mt={8}
        w={'full'}
        bgGradient="linear(to-r, green.400,green.700)"
        color={'white'}
        _hover={{
          bgGradient: 'linear(to-r, green.400,green.800)',
          boxShadow: 'xl',
        }}>
        Login
      </Button>
      <Text color={'gray.600'}>Don't have an account? Sign up</Text> 
      <Text as="span" cursor="pointer" fontWeight="600" onClick={handleChangeForm} color={'gray.500'}>here</Text>
      </form>
    </Box>
    form
  </Stack>
  </motion.div>
  )
}