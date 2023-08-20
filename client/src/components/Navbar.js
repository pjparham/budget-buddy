import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Tooltip
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FcMoneyTransfer } from 'react-icons/fc'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

const NavLink = (props) => {
  const { children } = props

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}>
      {children}
    </Box>
  )
}

export default function Nav({ user, setUser }) {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()

  function handleLogout(e){
    e.preventDefault()
    fetch('/api/logout',{
        method: "DELETE"
    }).then(() =>setUser(null))
    navigate('/')
  }

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Tooltip label='Home'>
          <Button
            leftIcon={<FcMoneyTransfer size={'3em'}/>}
            variant={'ghost'}
            onClick={() => navigate('/home')}
            >BudgetBuddy</Button>
            </Tooltip>
            
          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Tooltip label='Toggle Dark/Light Mode'>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
              </Tooltip>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={'https://www.svgrepo.com/show/5125/avatar.svg'}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar
                      size={'2xl'}
                      src={'https://www.svgrepo.com/show/5125/avatar.svg'}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{user?.name}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem onClick={() => navigate('/user/profile')}>Account Settings</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}