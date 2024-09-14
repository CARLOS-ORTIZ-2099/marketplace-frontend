import { useAuth } from "../context/AuthProvider"
import { Link } from "react-router-dom"
import { Box, Button, FormLabel, Input, Text } from "@chakra-ui/react"
import { useFormAuth } from "../hooks/useFormAuth"

const initial = {email :'', password : '', name : '', lastName : ''}

export const Register = () => {

  const {handlerRegister, errorRegister} = useAuth()  
  const {formData, handlerChange, setFormData, validateErrors} = useFormAuth(initial)


  const sendData = (e) => {
    e.preventDefault()
    if(!validateErrors()) {
      return alert('todos los campos son obligatorios')
    }
    handlerRegister(formData)
    setFormData(initial)
  }


  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} minH={'70vh'}>
       
      <Box w={{base : '90%', sm : '450px'}}>

        <Text fontSize={{base : '3xl', lg : '5xl'}}>Registro</Text>

        <Box as="form" onSubmit={sendData} noValidate>

          <FormLabel>Email address</FormLabel>
          <Input name="email" type='email' placeholder="email" borderRadius={'18'} value={formData.email} onChange={handlerChange}/>
          {
            errorRegister?.email && <Text color={'tomato'} fontWeight={'bold'}>{errorRegister?.email}</Text>
          }
          {
            errorRegister?.message && <Text color={'tomato'} fontWeight={'bold'}>{errorRegister?.message}</Text>
          }

          <FormLabel>password</FormLabel>
          <Input name="password" type='text' placeholder="password" borderRadius={'18'} value={formData.password} onChange={handlerChange}/>
          {
            errorRegister?.password && <Text color={'tomato'} fontWeight={'bold'}>{errorRegister?.password}</Text>
          }

          <FormLabel>name</FormLabel>
          <Input name="name"  type='text' placeholder="name" borderRadius={'18'} value={formData.name} onChange={handlerChange}/>
          {
            errorRegister?.name && <Text color={'tomato'} fontWeight={'bold'}>{errorRegister?.name}</Text>
          }

          <FormLabel>lastName</FormLabel>
          <Input name="lastName" type='text' placeholder="lastName" borderRadius={'18'} value={formData.lastName} onChange={handlerChange}/>
          {
            errorRegister?.lastName && <Text color={'tomato'} fontWeight={'bold'}>{errorRegister?.lastName}</Text>
          }

          <Button type="submit" colorScheme="teal" my={'5'} width={'100%'} borderRadius={'18'}>
            registro
          </Button>

        </Box>

        <Link to={'/login'}>ya tienes una cuenta inicia sesion</Link>
  
      </Box>

    </Box>
  )
}
