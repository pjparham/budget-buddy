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
  NumberInput,
  NumberInputField,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
  Icon,
  useColorModeValue,
  createIcon,
} from '@chakra-ui/react'
import Navbar from './Navbar'
import { BiMoneyWithdraw } from 'react-icons/bi'
import { motion } from 'framer-motion'

export default function CallToActionWithAnnotation({ setUser, user }) {
    const { isOpen, onToggle } = useDisclosure()

  return (
    <>
    <Navbar setUser={setUser} />
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Heading
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
                    onClick={onToggle}
                    colorScheme={'green'}
                    bg={'green.400'}
                    rounded={'full'}
                    px={6}
                    _hover={{
                      bg: 'green.500',
                    }}>Create Your Budget</Button>
                <Collapse in={isOpen} animateOpacity>
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
                    <Stack divider={<StackDivider />} spacing={4}>
                    <Box>
                        <Heading size='xs' textTransform='uppercase'>
                        Budget Name
                        </Heading>
                        <br />
                        <Input />
                    </Box>
                    <Box>
                        <Heading size='xs' textTransform='uppercase'>
                        Amount
                        </Heading>
                        <br />
                            <NumberInput>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                            </NumberInput>
                    </Box>
                    <Button 
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
                </CardBody>
                </Card>
                    </Box>
                </Collapse>
          </Stack>
        </Stack>
      </Container>
    
    </>
  )
}