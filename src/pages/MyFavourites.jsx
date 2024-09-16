/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import { instance } from "../libs/axiosConfig"
import { useProduct } from "../context/ProductsProvider"
import { useAuth } from "../context/AuthProvider"
import { ProductCard } from "../components/ProductCard"
import { Box } from "@chakra-ui/react"


const MyFavourites = () => {

  const {auth} = useAuth()
  const {favourites, setFavourites, getAllUserFavourites} = useProduct()
  const [error, setError] = useState(null)  

    useEffect(() => {
      if(auth) {
        getAllUserFavourites()  
      }   
    }, [auth])


    function memorize () {    
        let tempo  
        let ind
        return (param = null, index = null) => {
           if(param && (index || index == 0)) {
            tempo = {...param}
            ind = index
           }
           if(!param){
             return {tempo, ind}
           } 
        }
    }
    const closure = useCallback(memorize(), [])
    

    const handleFavourite = async(product, index) => { 
      try {
        closure(product, index)
        setFavourites((previous) => {
            const data = previous.filter((ele) => ele.product._id != product._id) 
            return data
        })
        alert(`eliminado correctamente`)
        await instance.post(`/user/addToFavorite/${product._id}`, {action : 'eliminar'})
      }catch(error) {
        setError(error)
      }
    }  

    useEffect(() => {
        let {tempo, ind} = closure()

        const favouritesUpdated = []
        for(let i = 0; i < favourites.length; i++) {

            if(ind == i) {
                favouritesUpdated.push({product : tempo})
            }
            favouritesUpdated.push(favourites[i])
        }

        while(ind >= favourites.length) {
            favouritesUpdated.push({product : tempo})
            ind--
        }

        setFavourites(favouritesUpdated)
    }, [error])


  return (
    <Box display={'flex'} justifyContent={'space-around'} mt={'5'} gap={'5'} flexWrap={'wrap'}>
        {
          favourites.length > 0 ? favourites?.map(({product}, index) => ( 
            <ProductCard key={product._id} product={product}
              handleFavourite={handleFavourite}
              index={index}
            />
          ))
          : <Box  color={'#2e7d8c'} fontWeight={'bold'}>no tienes favoritos</Box>
        }
    </Box>
  )
}

export default MyFavourites


