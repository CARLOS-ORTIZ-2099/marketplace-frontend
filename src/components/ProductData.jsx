/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useProduct } from "../context/ProductsProvider";
import { Box, Button } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faHeart as heartWhite } from "@fortawesome/free-regular-svg-icons";

export const ProductData = ({product, less, more, quantity, add, loading, deleteProduct, handleFavourite}) => {

  const {user} = useAuth()  
  const { favourites } = useProduct()

  function buttonFavourite() { 
    return  favourites.find((fv) => fv?.product._id == product._id) 
    ? (
          <Button colorScheme='teal' variant='ghost' mt={'10'} onClick={() => handleFavourite(true)}>
            <FontAwesomeIcon icon={faHeart} style={{color: "#2e7d8c",}} />
          </Button>
      )
      : product.seller._id !== user._id &&
      (
          <Button colorScheme='teal' variant='ghost' mt={'10'} onClick={() => handleFavourite(false)} >
            <FontAwesomeIcon icon={heartWhite} />
          </Button>
      )
  }


  return (
    <Box flex={'.6 1 0'} textAlign={'center'}>
        <Box as="h1" fontSize={{base:'3xl', md : '6xl'}}>{product.name}</Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>description : {product.description}</Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>stock : {product.quantityMax}</Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>brand : {product.brand}</Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>category : {product.category}</Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>modo de envio : {product.deliveryMethod}</Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>estado : {product.state}</Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>garantia : {product.warranty}</Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>vendedor: {product.seller.name} {product.seller.lastName}</Box>
        <Box as="p" fontSize={{base:'xl', md : '2xl'}}>precio: {product.coin == 'soles' ? 'S/' : '$'} {product.price}</Box>
        
        {
            buttonFavourite()
        }

        <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} gap={'1rem'} mt={'5'}> 
            {
                product.seller._id === user._id 
                ? (
                    <>
                        <Button onClick={() => deleteProduct(product._id)} colorScheme="red" size={{base : 'sm', lg : 'md'}}>
                            eliminar producto
                        </Button>

                        <Button colorScheme="blue" size={{base : 'sm', lg : 'md'}}>
                            <Link to={`/profile/formPage/${product._id}`}>
                                editar producto producto
                            </Link>
                        </Button>
                    </>
                )
                : (
                    <>
                        <Button onClick={less} colorScheme="teal" size={{base : 'md', lg : 'md'}}>
                            <FontAwesomeIcon icon={faMinus} />
                        </Button>

                        <Button size={{base : 'md', lg : 'md'}} colorScheme='teal' variant='ghost'>
                            {quantity}
                        </Button>

                        <Button onClick={more} colorScheme="teal" size={{base : 'md', lg : 'md'}}>
                            <FontAwesomeIcon icon={faPlus} />
                        </Button>
                
                        <Button colorScheme="teal" onClick={add} disabled={loading || product.quantityMax === 0}>
                            {loading ? 'agregando' : 'agregar al carrito'}
                        </Button> 
                    </>
                )
            }
        </Box> 

    </Box>
  )
}
