import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthProvider"
import { Link, Navigate } from "react-router-dom"
import { Box, Button, FormLabel, Input, Text } from "@chakra-ui/react"


export const Login = () => {

  const {handlerLogin, auth} = useAuth()  

   const [email, setEmail]  = useState('carlos1@gmail.com') 
   const [password, setPassword]  = useState('123456') 
   const [redirect, setRedirect] = useState(null)
 

   useEffect(() => {
      auth && setRedirect('/')
   }, [auth])


  const sendData = (e) => {
    e.preventDefault()
    handlerLogin({email, password})
  }


  if(redirect) return <Navigate to={redirect}/>



  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}  minH={'70vh'}>
      <Box  w={{base : '90%', sm : '450px'}} >
        <Text fontSize={{base : '3xl', lg : '5xl'}}>Login</Text>

        <Box as="form" onSubmit={sendData} >
           
          <FormLabel>Email address</FormLabel>
          <Input  type='email' placeholder="email" borderRadius={'18'} value={email} onChange={(e) => setEmail(e.target.value)}/>
             
    
          <FormLabel>password</FormLabel>
          <Input type='text' placeholder="password" borderRadius={'18'} value={password}  onChange={(e) => setPassword(e.target.value)}/>
        

          <Button type="submit" colorScheme="teal" my={'5'} width={'100%'} borderRadius={'18'}>
              login
          </Button>

        </Box>
          
        <Link to={'/register'}>no tienes una cuenta? registrate</Link>
           
      </Box>
    </Box>
  )
}
