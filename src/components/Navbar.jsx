import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"
import { Box, Text } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faHouse, faCartShopping, faUser} from '@fortawesome/free-solid-svg-icons'

export const Navbar = () => {
  const {auth} = useAuth() 
   
  return (
    <Box as="nav" 
      bg={'#219ebc'} 
      mb={'10'}
      minH={'10vh'}
      p={'.5rem'}
    >
        <Box 
          as="ul" 
          display={'flex'} 
          justifyContent={'space-around'} 
          border={'solid blue 2px'}
          alignItems={'center'} 
          listStyleType={'none'} 
          textAlign={'center'}
          height={'10vh'}
        >
            <Box as="li">
              <Link to={`/`}>
                <FontAwesomeIcon icon={faHouse} size="xl"/>
                <Text>home</Text>
              </Link>
              
            </Box>
            <Box as="li">
              <Link to={'/cart'}>
                <FontAwesomeIcon icon={faCartShopping} size="xl"/>
                <Text>cart</Text>
              </Link>
              
            </Box>
            <Box as="li">
              <Link to={`/${auth ?'profile' : 'login'}`}>
                <FontAwesomeIcon icon={faUser} size="xl"/>
                <Text>profile</Text>
              </Link>
              
            </Box>
        </Box>
    </Box>
  )

}
