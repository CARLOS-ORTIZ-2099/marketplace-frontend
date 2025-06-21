import { Avatar, Box, Button, Container, FormControl, FormLabel, Input, Text } from "@chakra-ui/react"
import { useAuth } from "../context/AuthProvider"
import { Link } from "react-router-dom"
import { useState } from "react"


 const MyProfile = () => {

  const {handlerCloseSession, user, handlerEditAvatar} = useAuth()
  const closeSession = async() => handlerCloseSession()  
  const [image, setImage] = useState({ file:'', result : ''})

  const uploadPhoto = (e) => {
    // creando la instancia del lector
    const reader = new FileReader();
    // capturando el archivo
    const file = e.target.files[0]
    console.log(file)
    
    // leyendo el archivo
    reader.readAsDataURL(file);
    // evento que se ejecuta cuando se termine de leer dicho archivo
    reader.addEventListener('load', (evt) => {
        //console.log(evt.target.result);
        setImage({file, result : evt.target.result})
      }
    )  
    
  }

  const sendData = async() => {
      const newFormData = new FormData()
      newFormData.append('images', image.file)
      console.log(Object.fromEntries(newFormData))
      handlerEditAvatar(newFormData, user._id)
      setImage({ file:'', result : ''})
  }

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
      <FormControl >
          <FormLabel cursor="pointer"textAlign={'center'}>
            <Input  type="file" 
              name="images"  
              onChange={uploadPhoto} 
              display="none" 
            />
            <Box >
              <Avatar bg='teal.500' size='2xl' name={`${user.name} ${user.lastName}`} src={image?.result || `${user?.avatar?.secure_url}`} />{' '}
            </Box>
            upload  
          </FormLabel> 
      </FormControl>
      {
        image.result && <Button onClick={sendData}>actualizar avatar</Button>
      }

        <Text as="cite" >{user.name} {user.lastName} - {user.email}</Text>

        <Box display={'flex'} gap={'2rem'} flexWrap={'wrap'}>
          <Button onClick={closeSession} display={'block'} mx={'auto'}colorScheme="teal">
            cerrar session  
          </Button>  

          <Button display={'block'} mx={'auto'}colorScheme="teal">
            <Link to={`/profile/editProfile/${user._id}`}>editar perfil </Link> 
          </Button>  
        </Box> 
   
       </Container>
    </Box>
  )
}
export default MyProfile