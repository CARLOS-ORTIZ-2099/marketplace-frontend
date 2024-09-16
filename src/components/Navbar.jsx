import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"
import { Box, Text } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faHouse, faCartShopping, faUser} from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  const {auth, user} = useAuth() 
   
  return (
    <Box as="nav" mb={'10'} minH={'10vh'} boxShadow='md' p='.5rem' rounded='md' bg='white'>
      <Box 
          as="ul" 
          display={'flex'} 
          justifyContent={'space-around'} 
          alignItems={'center'} 
          listStyleType={'none'} 
          textAlign={'center'}
          height={'10vh'}
        >
            <Box as="li">
              <Link to={`/`}>
                <FontAwesomeIcon icon={faHouse} style={{color: "#2e7d8c"}} size="xl"/>
                <Text fontWeight={'bold'} color={'#2e7d8c'}>home</Text>
              </Link>  
            </Box>

            <Box as="li">
              <Link to={'/cart'}>
                <FontAwesomeIcon icon={faCartShopping} style={{color: "#2e7d8c"}} size="xl"/>
                <Text fontWeight={'bold'} color={'#2e7d8c'}>cart</Text>
              </Link>
            </Box>

            <Box as="li">
              <Link to={`/${auth ?'profile' : 'login'}`}>
                <FontAwesomeIcon icon={faUser} style={{color: "#2e7d8c"}}  size="xl"/>
                <Text fontWeight={'bold'} color={'#2e7d8c'}>{user?.name ? user.name : 'profile'}</Text>
              </Link>
            </Box>
            
      </Box>
    </Box>
  )

}

export  default Navbar
