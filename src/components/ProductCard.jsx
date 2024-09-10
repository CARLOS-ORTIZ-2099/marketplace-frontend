/* eslint-disable react/prop-types */
import { Box, Button, Card, CardBody, CardFooter, Divider, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom"


export const ProductCard = ({product}) => {
    console.log(product);
    
  return (
    <Box /* border={'solid red 2px'} */>
        <Card maxW='sm'>

            <CardBody>
                <Image
                    src={product?.images?.[0].secure_url}
                    alt='product'
                    borderRadius='lg'
                    height={'200px'}
                />

                <Stack mt='6' spacing='3'>

                    <Heading size='md'>{product.brand}</Heading>
                    <Text>{product.name}</Text>
                    {/* importador */}
                    <Text color='blue.600' fontSize='2xl'>
                        {
                            product.coin === 'soles' 
                            ? 'S/' 
                            : '$'
                        } 
                        {product.price}
                    </Text>
                    
                </Stack>

            </CardBody>

            <Divider/>

            <CardFooter>
                <Button mx={'auto'} variant='solid' colorScheme='blue'>
                   <Link to={`/product-details/${product._id}`}>
                   see more
                   </Link>
                </Button>
            </CardFooter>
            
        </Card>
    </Box>
  )
}
