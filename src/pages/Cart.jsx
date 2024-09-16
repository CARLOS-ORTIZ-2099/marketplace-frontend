/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthProvider"
import { instance } from "../libs/axiosConfig";
import { useProduct } from "../context/ProductsProvider";
import { TemplateCarritoProduct } from "../components/TemplateCarritoProduct";
import { CartEmpty } from "./CartEmpty";


const Cart = () => {

    const {auth} = useAuth()  
    const {showCartItems, carrito, setCarrito} = useProduct()
  
    useEffect(() => { 
      if(auth) {
        showCartItems()  
      }     
    }, [auth])

    const changeQuantityMore = (id) => {
      setCarrito((previous) => {
        const updatedCart = previous.map((product) =>
          product._id === id && product.quantityItem < product.product.quantityMax
            ? {
                ...product,
                quantityItem: product.quantityItem + 1,
                total: (product.quantityItem + 1) * product.priceItem,
              }
            : product
        );
        const product = updatedCart.find((p) => p._id === id);

        updateOptions(id, product.quantityItem); 
        return updatedCart;
      });

    };
    

    const changeQuantityLess = (id) => {

      setCarrito(previous => { 
        const updatedCart = previous.map((product) => 
          product._id == id && product.quantityItem > 1 ? 
          {
            ...product,
            quantityItem : product.quantityItem-1,
            total : (product.quantityItem-1)*product.priceItem 
          } 
          : product     
        );
        const product = updatedCart.find((p) => p._id === id);
        updateOptions(id, product.quantityItem); 
        return updatedCart;
      } )

    }


    const updateOptions = useCallback(

      debounce( (id, totalQuantity) => {
        instance.put(`/user/updateCart/${id}`, { quantity: totalQuantity })
        .then(data => console.log(data.data))
        .catch(error => console.log(error))
         
      }, 300),
      
      []

    );
  
     
   function debounce(cb, delay = 250) {
  
    let timeout
   
    return (...args) => {

      clearTimeout(timeout)
  
      timeout = setTimeout(() => {
        cb(...args)
      }, delay)
  
    }
  
   }

   const removeCartProduct = async (id) => {
      try {
        await instance.delete(`/user/removeCartProduct/${id}`)
        setCarrito( carrito.filter((previous) => (
          previous._id !== id
        )) )
      }catch(error) {
        console.log(error)
      }
   }  
   
   const buyTheOrder = async (id) => {
    try {
        await instance.delete(`/user/buyTheOrder/${id}`)
        setCarrito( carrito.filter((previous) => (
          previous._id !== id
        )) )
      }catch(error) {
        console.log(error)
      }
   }

    
  return (
    <>
      {
        carrito.length > 0
        ? <TemplateCarritoProduct 
            funciones={{changeQuantityLess, changeQuantityMore, removeCartProduct, buyTheOrder}}
          />
        : <CartEmpty/>
      }
    </>
  )
}


export default Cart



