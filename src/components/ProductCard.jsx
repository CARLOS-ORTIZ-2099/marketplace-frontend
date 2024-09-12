/* eslint-disable react/prop-types */
import { Box, Button, Card, CardBody, CardFooter, Divider, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom"


export const ProductCard = ({product , handleFavourite = null, index = null}) => {
    
  return (
    <Box boxShadow='xl' rounded='md' bg='white'>
        <Card maxW='sm'>

            <CardBody>
                <Image src={product?.images?.[0].secure_url} 
                    alt='product'
                    borderRadius='lg'
                    height={'200px'}
                    width={'300px'}
                    loading="lazy"
                />

                <Stack mt='6' spacing='3'>
                    <Heading size='md'>{product.brand}</Heading>
                    <Text>{product.name}</Text>
                    <Text color='blue.600' fontSize='2xl'>
                        { product.coin === 'soles' ? 'S/' : '$'} 
                        {product.price}
                    </Text>   
                </Stack>

            </CardBody>

            <Divider/>

            <CardFooter>
                <Button mx={'auto'} variant='solid' colorScheme='teal'>
                   <Link to={`/product-details/${product._id}`}>
                        see more
                   </Link>
                </Button>
                {
                    handleFavourite && 
                    <Button colorScheme="red" 
                        onClick={() => handleFavourite(product, index)}
                    >
                        eliminar de favoritos
                    </Button>
                }
            </CardFooter>
            
        </Card>
    </Box>
  )
}
