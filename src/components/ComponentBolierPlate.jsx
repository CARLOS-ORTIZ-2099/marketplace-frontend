/* eslint-disable react/prop-types */
import { Box } from "@chakra-ui/react"



export const ComponentBolierPlate = ({product}) => {

 

  return (
    <>
       <Box as="h1" fontSize={{base:'3xl', md : '6xl'}} color={'teal'}>
                {product.name}
        </Box>

        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>
            <Box as="span" color={'gray'}fontWeight={'bold'}>description : </Box>
                {product.description}
        </Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>
                
                <Box as="span" color={'gray'}fontWeight={'bold'}>stock :  </Box> 
                {product.quantityMax}
        </Box>

        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>
                <Box as="span" color={'gray'}fontWeight={'bold'}>brand : </Box> 
                brand : {product.brand}
        </Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>
                <Box as="span" color={'gray'}fontWeight={'bold'}>category :  </Box> 
                {product.category}
        </Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>
                <Box as="span" color={'gray'}fontWeight={'bold'}>modo de envio : </Box> 
                 {product.deliveryMethod}
        </Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>
            <Box as="span" color={'gray'}fontWeight={'bold'}>estado : </Box> 
            {product.state}
        </Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>
            <Box as="span" color={'gray'}fontWeight={'bold'}> garantia : </Box> 
            {product.warranty}
        </Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>
            <Box as="span" color={'gray'}fontWeight={'bold'}>  vendedor:  </Box> 
           {product.seller.name} {product.seller.lastName}
        </Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>
            <Box as="span" color={'gray'}fontWeight={'bold'}>   precio:  </Box> 
            {product.coin == 'soles' ? 'S/' : '$'} {product.price}
        </Box>
    </>
  )
}
