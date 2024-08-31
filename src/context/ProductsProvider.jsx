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
        console.log('ejecutando carrito del contexto'); 
        // en este punto si auth es true entonces el usuario ya inicio sesion y 
        // se sincronizo el carrito local si lo tuviese con lo de la db  
        // entonces debemos obtener esos productos 
        if(auth) {
            showItemsCart()
            getAllFavouriteUser() 
        }else {
            setCarrito([]) 
            setFavourites([])
        }
    } ,[auth]) 
 

    const showItemsCart = async() => { 
        try {
            // traer todos los productos del carrito de la db del usuario
            const {data} =  await instance.get(`/user/showCartItems`)
            console.log(data);
            if(data.updateData) {
                alert('mientras navegabas uno a mas productos de tu carrito sufrieron algunos cambios de precio y/o stock')
            }
            setCarrito(data.cart)
            
        }catch(error) {
            console.log(error)
        }
    }
    

    const getAllFavouriteUser = async() => {
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

