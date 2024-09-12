import { useState } from "react"
import { useAuth } from "../context/AuthProvider"
import { Link } from "react-router-dom"
import { Box, Button, FormLabel, Input, Text } from "@chakra-ui/react"


export const Register = () => {

  const {handlerRegister} = useAuth()  

   const [email, setEmail]  = useState('') 
   const [password, setPassword]  = useState('') 
   const [name, setName]  = useState('') 
   const [lastName, setLastName]  = useState('') 

   

  const sendData = (e) => {
    e.preventDefault()
    handlerRegister({email, password, name, lastName})
  }


  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} minH={'70vh'}>
       
      <Box w={{base : '90%', sm : '450px'}}>

        <Text fontSize={{base : '3xl', lg : '5xl'}}>Registro</Text>

        <Box as="form" onSubmit={sendData}>

          <FormLabel>Email address</FormLabel>
          <Input  type='email' placeholder="email" borderRadius={'18'} value={email} onChange={(e) => setEmail(e.target.value)}/>

          <FormLabel>password</FormLabel>
          <Input  type='text' placeholder="password" borderRadius={'18'} value={password} onChange={(e) => setPassword(e.target.value)}/>

          <FormLabel>name</FormLabel>
          <Input  type='text' placeholder="name" borderRadius={'18'} value={name} onChange={(e) => setName(e.target.value)}/>

          <FormLabel>lastName</FormLabel>
          <Input  type='text' placeholder="lastName" borderRadius={'18'} value={lastName} onChange={(e) => setLastName(e.target.value)}/>

          <Button type="submit" colorScheme="teal" my={'5'} width={'100%'} borderRadius={'18'}>
            registro
          </Button>


        </Box>

        <Link to={'/login'}>ya tienes una cuenta inicia sesion</Link>
  
      </Box>

    </Box>
  )
}
