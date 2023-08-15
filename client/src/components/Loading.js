import React from 'react'
import { Heading, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import MoneyBag from '../lottie/MoneyBag.json'

export default function Loading() {
  return (
    <>
    <Heading
        as={motion.h1}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        fontWeight={600}
        fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
        mb={'25'}
        lineHeight={'110%'}>
      <Text as={'span'} 
          bgGradient="linear(to-r, green.400,green.700)"
          bgClip="text"
          >
        <br />
        Loading...
        </Text>
    </Heading>
    <Lottie loop={true} animationData={MoneyBag} />
    </>
  )
}
