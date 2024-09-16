/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "../context/AuthProvider"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Box, Button, FormLabel, Input, Text, Textarea} from "@chakra-ui/react"
import { useFormAuth } from "../hooks/useFormAuth"
import { useEffect } from "react"


const initial = {email :'', password : '', name : '', lastName : ''}

 const Register = () => {

  const {handlerRegister, errorRegister, handlerEditUser, user, updated, setUpdated} = useAuth()  
  const {formData, handlerChange, setFormData, validateErrors} = useFormAuth(initial)
  const {id}  = useParams()
  const navigate = useNavigate()
 


 useEffect(() => {  
  if(updated) {
    navigate('/profile')
    setUpdated(false)
  }
 }, [updated])

  useEffect(() => {
    if(id) {
      setFormData({email :user.email, name : user.name, lastName : user.lastName, password : '', bio : user.bio || ''})
    }
  }, [])


  const sendData = (e) => {
    e.preventDefault()
    if(id) {
      handlerEditUser(formData, id)
      return
    }
    if(!validateErrors()) {
      return alert('todos los campos son obligatorios')
    }
    handlerRegister(formData)
    setFormData(initial)
  }


  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} minH={'70vh'}>
       
      <Box w={{base : '90%', sm : '450px'}}>

        <Text fontSize={{base : '3xl', lg : '5xl'}}>{id ? 'editar' : 'Registro'}</Text>

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

          {
            id && (
              <>
                <FormLabel>bio</FormLabel>
                <Textarea name="bio" placeholder="bio" resize={'none'}
                  borderRadius={'18'} value={formData.bio} onChange={handlerChange}
                />
              </>
            )
          }

          <Button type="submit" colorScheme="teal" my={'5'} width={'100%'} borderRadius={'18'}>
              {id ? 'editar' : 'Registro'}
          </Button>

        </Box>

        <Link to={'/login'}>ya tienes una cuenta inicia sesion</Link>
  
      </Box>

    </Box>
  )
}

export default Register
