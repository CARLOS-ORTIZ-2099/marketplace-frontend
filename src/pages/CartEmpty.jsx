import { Box, Button, Image } from '@chakra-ui/react'
import cartEmptyImage from '../assets/cartEmpty.svg'
import { Link } from 'react-router-dom'


export const CartEmpty = () => {
  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} minH={'70vh'}>

        <Box  as='h1' color={'teal'} fontWeight={'bolder'} fontSize={'x-large'}>
            Tu Carrito Esta Vacio
        </Box>

        <Image src={cartEmptyImage} boxSize='200px' objectFit='cover'/>

        <Button colorScheme='teal' size='md' mt={'3'} ml={'10'}>
          <Link to={'/'}> Ir A Comprar</Link>
        </Button>
        
    </Box>
  )
}
