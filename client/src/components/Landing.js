import {
    Box,
    Flex,
    Stack,
    Heading,
    Text,
    Container,
    Input,
    Button,
    SimpleGrid,
    useBreakpointValue,
    Icon,
  } from '@chakra-ui/react';
  import { FcMoneyTransfer, FcCalculator } from 'react-icons/fc';
  import { useState } from 'react';
  import Signup from './Signup';
  import Login from './Login';

  export default function Landing() {
    const [isLogin, setIsLogin] = useState(false)
    const [user, setUser] = useState({
      "name": "",
      "email": "",
      "password": ""
    })

    function handleChange(e){
      setUser({
        ...user,
        [e.target.name]: e.target.value,
      })
    }


    return (
      <Box position={'relative'}>
        <Container
          as={SimpleGrid}
          maxW={'7xl'}
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 10, lg: 32 }}
          py={{ base: 10, sm: 20, lg: 32 }}>
          <Stack spacing={{ base: 10, md: 20 }}>
            <Heading
              lineHeight={1.1}
              fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
              Budget{' '}
              <Text
                as={'span'}
                bgGradient="linear(to-r, green.400,green.700)"
                bgClip="text">
                Buddy
              </Text>{' '}
            </Heading>
            <Stack direction={'column'} spacing={5} align={'center'}>

                <FcMoneyTransfer size={'5em'}/>
                <FcCalculator size={'5em'}/>
              
              <Text fontFamily={'heading'} fontSize={{ base: '3xl', md: '5xl' }}>
                +
              </Text>
              <Flex
                align={'center'}
                justify={'center'}
                fontFamily={'heading'}
                fontSize={{ base: 'sm', md: 'lg' }}
                bg={'gray.800'}
                color={'white'}
                rounded={'full'}
                minWidth={useBreakpointValue({ base: '44px', md: '60px' })}
                minHeight={useBreakpointValue({ base: '44px', md: '60px' })}
                position={'relative'}
                _before={{
                  content: '""',
                  width: 'full',
                  height: 'full',
                  rounded: 'full',
                  transform: 'scale(1.125)',
                  bgGradient: 'linear(to-bl, orange.400,green.400)',
                  position: 'absolute',
                  zIndex: -1,
                  top: 0,
                  left: 0,
                }}>
                 YOU
              </Flex>
            </Stack>
          </Stack>
          {isLogin ? 
          <Login user={user} handleChange={handleChange} setIsLogin={setIsLogin}/> :
          <Signup user={user} handleChange={handleChange} setIsLogin={setIsLogin}/>
          }
        </Container>
        <Blur
          position={'absolute'}
          top={-10}
          left={-10}
          style={{ filter: 'blur(80px)' }}
        />
      </Box>
    );
  }
  
  export const Blur = (props) => {
    return (
      <Icon
        width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
        zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
        height="560px"
        viewBox="0 0 528 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}>
        <circle cx="71" cy="61" r="111" fill="#008000" />
        <circle cx="244" cy="106" r="139" fill="#AFE1AF" />
        <circle cy="291" r="139" fill="#DFFF00" />
        <circle cx="80.5" cy="189.5" r="101.5" fill="#E4D00A" />
        <circle cx="196.5" cy="317.5" r="101.5" fill="#50C878" />
        <circle cx="70.5" cy="458.5" r="101.5" fill="#4F7942" />
        <circle cx="426.5" cy="-0.5" r="101.5" fill="#7CFC00" />
      </Icon>
    );
  };