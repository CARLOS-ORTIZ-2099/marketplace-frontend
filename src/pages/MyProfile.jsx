import { Box, Button, Container, Text } from "@chakra-ui/react"
import { useAuth } from "../context/AuthProvider"


export const MyProfile = () => {

  const {handlerCloseSession, user} = useAuth()
 

  const closeSession = async() => handlerCloseSession()  

  return (
    <Box bg={'whitesmoke'} minH={'100vh'}>

       <Container minH={'50vh'}
        display={'flex'} flexDirection={'column'} justifyContent={'space-around'}
        alignItems={'center'}
       >

        <Text fontSize={{base : '3xl', lg : '5xl'}} fontWeight={'bold'}>MyProfile</Text>

        <Text as="i" >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt quo mollitia magnam laboriosam
           quasi nesciunt qui fugiat est ut cupiditate doloremque rem iusto nisi nulla, repudiandae 
           exercitationem porro. Velit, exercitationem!
        </Text>

        <Text as="cite" >{user.name} {user.lastName} - {user.email}</Text>

        <Box>
          <Button onClick={closeSession} display={'block'} mx={'auto'}colorScheme="teal">
            cerrar session  
          </Button>  
        </Box> 

       </Container>
    </Box>
  )
}
