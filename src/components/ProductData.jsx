/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useProduct } from "../context/ProductsProvider";
import { Box, Button } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faHeart as heartWhite } from "@fortawesome/free-regular-svg-icons";
import { ComponentBolierPlate } from "./ComponentBolierPlate";
import { useCallback, useState } from "react";
import { instance } from "../libs/axiosConfig";

export const ProductData = ({product, add, loading, deleteProduct}) => {

  const [quantity, setQuantity] = useState(1)
  const {user, auth} = useAuth()  
  const { favourites, setFavourites } = useProduct()
  const navigate = useNavigate()

  const changeQuantityMore = () => setQuantity(previous => previous >= product.quantityMax ? previous : previous+1)
  
  const changeQuantityLess = () => setQuantity(previous => previous <= 1 ? previous :  previous-1)

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

  const handleFavourite = async(boolean) => {
    console.log(boolean);
    if(!auth){
        navigate('/login')
        return
    }
    if(boolean){  
        setFavourites((previous) => {
            const data = previous.filter((ele) => ele.product._id != product._id)
            functionFavourite(product._id, {action:'eliminar'})
            return data
        })
    }
    else {
        setFavourites((previous) =>{
            let data = [...previous, {product : {...product}}]  
            functionFavourite(product._id, {action :'crear'})
            return data
        }) 
    }

   }

   const functionFavourite = useCallback(debounce((idParam, body) => {
        instance.post(`/user/addToFavorite/${idParam}`, body)
        .then(data => console.log(data.data))
   }, 500 ), [] )

   function debounce(cb, delay) { 
        let time
        return (id, body) => {

           clearTimeout(time)

           time = setTimeout(() => {
                cb(id, body)
            }, delay)

        }
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
                        <Button onClick={changeQuantityLess} colorScheme="teal" size={{base : 'md', lg : 'md'}}>
                            <FontAwesomeIcon icon={faMinus} />
                        </Button>

                        <Button size={{base : 'md', lg : 'md'}} colorScheme='teal' variant='ghost'>
                            {quantity}
                        </Button>

                        <Button onClick={changeQuantityMore} isDisabled={quantity>=product.quantityMax} colorScheme="teal" size={{base : 'md', lg : 'md'}}>
                            <FontAwesomeIcon icon={faPlus} />
                        </Button>
                
                        <Button onClick={() => add(quantity)} isDisabled= {loading || product.quantityMax === 0} colorScheme="teal" >
                            {loading ? 'agregando' : 'agregar al carrito'}
                        </Button> 
                    </>
                )
            }
        </Box> 
    </Box>
  )
}
