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
        // debemos obtener sus productos del carrito y sus favoritos
        if(auth) {
            showCartItems()
            getAllUserFavourites() 
            return 
        }
        setCarrito([]) 
        setFavourites([])    
        
    } ,[auth]) 
   

    const showCartItems = async() => {  
        try {
            // traer todos los productos del carrito de la db del usuario
            const {data} =  await instance.get(`/user/showCartItems`)
            //console.log(data);
            if(data.shouldUpdatedCart) {
                alert('mientras navegabas uno a mas productos de tu carrito sufrieron algunos cambios de precio y/o stock')
            }
            setCarrito(data.cart)    
        }catch(error) {
            console.log(error)
        }
    }
     
   
    const getAllUserFavourites = async() => {
        try {  
            // traer todos los productos del carrito de la db del usuario
            const {data} =  await instance.get(`/user/getAllUserFavourites`)
            console.log(data);
            setFavourites(data.favouritesFound)        
        }catch(error) {
            console.log(error)
        }
    }


    const data = {
        showCartItems,
        carrito,
        setCarrito,
        favourites,
        setFavourites,
        getAllUserFavourites
    }

  return (
    <ProductsContext.Provider value={data}>
        {children}
    </ProductsContext.Provider>
  )

}

