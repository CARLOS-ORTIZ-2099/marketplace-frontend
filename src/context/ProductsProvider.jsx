/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react"
import { instance } from "../libs/axiosConfig"
import { useAuth } from "./AuthProvider"



export const useProduct = () => {
    const auth = useContext(ProductsContext)
    if(!auth) throw new Error('error exists')
    return auth    
}

const ProductsContext = createContext() // creando contexto

export const ProductsProvider = ({children}) => {
    const {auth} = useAuth()
    const [carrito, setCarrito] = useState([]) 
    const [favourites, setFavourites] = useState([])    

    useEffect(() => {
        if(auth) {
            showItemsCart()
            getAllUserFavourite()
        }else {
            setCarrito([])
            
        }
    } ,[auth])
 

    const showItemsCart = async() => {
        try {
            // traer todos los productos del carrito de la db del usuario
            const {data} =  await instance.get(`/user/showCartItems`)
            //console.log(data);
            setCarrito(data.response)
            
        }catch(error) {
            console.log(error)
        }
    }
    

    const getAllUserFavourite = async() => {
        try {
            // traer todos los productos del carrito de la db del usuario
            const data =  await instance.get(`/user/seeAllFavoriteToUser`)
            //console.log(data);
            setFavourites(data.data.favoritesFound)
            
        }catch(error) {
            console.log(error)
        }
    }


    const data = {
        showItemsCart,
        carrito,
        setCarrito,
        favourites,
        setFavourites
    }

  return (
    <ProductsContext.Provider value={data}>
        {children}
    </ProductsContext.Provider>
  )

}

