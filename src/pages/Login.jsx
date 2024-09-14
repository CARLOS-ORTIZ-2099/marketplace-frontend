import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthProvider"
import { Link, Navigate } from "react-router-dom"
import { Box, Button, FormLabel, Input, Text } from "@chakra-ui/react"
import { useFormAuth } from "../hooks/useFormAuth"

const initial = {email :'', password : ''}

export const Login = () => {

  const {handlerLogin, auth, errorLogin} = useAuth()  
  const {formData, validateErrors, handlerChange} = useFormAuth(initial)
  const [redirect, setRedirect] = useState(null)
 

   useEffect(() => {
      auth && setRedirect('/')
   }, [auth])


  const sendData = (e) => {
    e.preventDefault()
    if(!validateErrors()) {
      return alert('todos los campos son obligatorios')    
    }
    handlerLogin(formData)
  }

  if(redirect) return <Navigate to={redirect}/>


  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}  minH={'70vh'}>
      <Box  w={{base : '90%', sm : '450px'}} >
        <Text fontSize={{base : '3xl', lg : '5xl'}}>Login</Text>

        <Box as="form" onSubmit={sendData} noValidate>
           
          <FormLabel>Email address</FormLabel>
          <Input name="email" type='email' placeholder="email" borderRadius={'18'} value={formData.email} onChange={handlerChange}/>
             
    
          <FormLabel>password</FormLabel>
          <Input name="password" type='text' placeholder="password" borderRadius={'18'} value={formData.password}  onChange={handlerChange}/>
        

          <Button type="submit" colorScheme="teal" my={'5'} width={'100%'} borderRadius={'18'}>
              login
          </Button>

        </Box>
          
        {
          errorLogin?.message && <Box mb={'2'} color={'tomato'}>{errorLogin.message}</Box>
        }

        <Link to={'/register'}>no tienes una cuenta? registrate</Link>
           
      </Box>
    </Box>
  )
}
