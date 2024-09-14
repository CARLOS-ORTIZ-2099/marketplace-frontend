/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useProduct } from "../context/ProductsProvider";
import { Box, Button } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faHeart as heartWhite } from "@fortawesome/free-regular-svg-icons";
import { ComponentBolierPlate } from "./ComponentBolierPlate";

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
    <Box flex={'1 1 0'} textAlign={'center'} >

        <ComponentBolierPlate product={product}/>
         
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
                                editar producto
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

                        <Button onClick={more} isDisabled={quantity>=product.quantityMax} colorScheme="teal" size={{base : 'md', lg : 'md'}}>
                            <FontAwesomeIcon icon={faPlus} />
                        </Button>
                
                        <Button onClick={add} isDisabled= {loading || product.quantityMax === 0} colorScheme="teal" >
                            {loading ? 'agregando' : 'agregar al carrito'}
                        </Button> 
                    </>
                )
            }
        </Box> 

    </Box>
  )
}
