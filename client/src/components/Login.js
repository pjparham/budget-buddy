import {
    Box,
    Stack,
    Heading,
    Text,
    Input,
    Button,
  } from '@chakra-ui/react';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BsPersonHearts } from 'react-icons/bs';

export default function Login({handleChange, userForm, setIsLogin, setUser}) {
    const navigate = useNavigate()
    function handleChangeForm(){
        setIsLogin(false)
    }


    function handleLogin(e){
        e.preventDefault()
        fetch(`/login`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userForm)
        })
        .then(res => {
            if (res.ok){
                res.json().then(setUser)
                console.log('success')
                return navigate("/login-test")
            } else {
                alert("Something went wrong")
            }
        })
    }

  return (
    <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    >
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
      Budget Buddy is a user-friendly mobile application designed to help individuals manage their personal finances effectively. 
      With a focus on simplicity and convenience, the app enables users to track their income, expenses, and savings in real-time.
      </Text>
    </Stack>
    <Box as={'form'} mt={10}>
      <Stack spacing={4}>
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
        <Input
          placeholder="Password"
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
      </Stack>
      <Button
        leftIcon={<BsPersonHearts />}
        fontFamily={'heading'}
        mt={8}
        w={'full'}
        bgGradient="linear(to-r, green.400,green.700)"
        color={'white'}
        onClick={handleLogin}
        _hover={{
          bgGradient: 'linear(to-r, green.400,green.800)',
          boxShadow: 'xl',
        }}>
        Login
      </Button>
      Don't have an account? Sign up <Text as="span" cursor="pointer" fontWeight="600" onClick={handleChangeForm}>here</Text>
    </Box>
    form
  </Stack>
  </motion.div>
  )
}