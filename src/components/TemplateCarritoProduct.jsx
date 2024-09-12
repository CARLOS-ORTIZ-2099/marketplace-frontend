/* eslint-disable react/prop-types */
import { Box, Container, Image } from "@chakra-ui/react"
import { faCcAmazonPay } from "@fortawesome/free-brands-svg-icons"
import { faCircleMinus, faCirclePlus, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"


export const TemplateCarritoProduct = ({carrito, funciones}) => {
    const {changeQuantityLess, changeQuantityMore, removeCartProduct,
        buyTheOrder
    } = funciones

  return (

    <Container maxW={{base : '100%', lg : '50%'}} mt={'5'} pt={'5'} boxShadow='xl' p='6' rounded='md' bg='white'>
        <Box pt={'5'} minH={'100vh'} display={'flex'} flexWrap={'wrap'} flexDirection={{base : 'column', lg : 'row'}}  >
            {/* seccion productos del carrito */}
            <Box flex={'1 1 0'}>
                {
                  carrito.map(ele => (
                    <Box key={ele._id} border={'solid #2e7d8c 1px'} mb={4} borderRadius={'5'}p={3} >
                        <Box display={'flex'}>
                            <Box flex={{base : '.6 1 0', lg : '.6 1 0'}}>
                                <Box>
                                    <Link to={`/product-details/${ele.product._id}`}>{ele.name}
                                    </Link>
                                </Box>
                                <Image src={ele.image} boxSize='100px' objectFit='cover' borderRadius={'5'}/>       
                            </Box>
                                                                                   
                            <Box flex={{base : '1 1 0', lg : '.4 1 0'}}>
                                <Box as="h2" className='fs-6'>stock: <b className='text-success'>{ele.product.quantityMax}</b></Box>
                                <Box as="h2" className='fs-6'>Precio: <b className='text-success'>{ele.priceItem} {ele.product.coin == 'soles' ? 'S/' : '$'}</b></Box>
                                <Box as="h2" className='fs-6'> Total: <b className='text-success-emphasis'> {ele.total}{ele.product.coin == 'soles' ? 'S/' : '$'}</b></Box>                              
                                <Box mt={'4'}display={'flex'} justifyContent={'space-around'}alignItems={'center'}>
                                    <FontAwesomeIcon icon={faCirclePlus} 
                                        style={{color: "#0d61f2",}}
                                        size="xl" 
                                        cursor={'pointer'}
                                        onClick={() => changeQuantityMore(ele._id)}
                                    />

                                    <Box as="h2" fontSize={{base : 'sm', lg : 'x-large'}}>
                                        {ele.quantityItem}
                                    </Box>
                                                                             
                                    <FontAwesomeIcon icon={faCircleMinus} 
                                        style={{color: "#e11414",}} 
                                        size="xl" 
                                        cursor={'pointer'}
                                        onClick={() => changeQuantityLess(ele._id)}
                                    />

                                    <FontAwesomeIcon icon={faTrashCan} 
                                        style={{color: "#5a5858",}} 
                                        size="xl" 
                                        cursor={'pointer'}
                                        onClick={() => removeCartProduct(ele._id)}
                                    />

                                    <FontAwesomeIcon icon={faCcAmazonPay} 
                                        size="xl"
                                        cursor={'pointer'}
                                        onClick={() => buyTheOrder(ele._id)}
                                    />
                                </Box>
                            </Box>
                        </Box>   
                    </Box>                                        
                  ))
                }    
            </Box>
        </Box>
    </Container>

  )
}
