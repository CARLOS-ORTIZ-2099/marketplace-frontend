/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider"
import { instance } from "../libs/axiosConfig";
import { useProduct } from "../context/ProductsProvider";


export const Cart = () => {

  const {user} = useAuth()  
  const {showItemsCart, carrito, setCarrito} = useProduct()

    useEffect(() => {
        showItemsCart()   
    }, [user])


    // => 

    // usecallback sirve para "memorizar" una funcion y que esta no se vuelva a crear, en posteriores renderizados
    // esto con el fin de evitar creaciones innecesarias y talvez mantener
    // un referencia a la funcion
    // el segundo parametro que recibe useCallback es un listado de dependencias
    // que si cambian debera de crearse nuevamente muy similar a useEffect
    // la constante updateOptions tendra como valor lo que devuelva la
    // ejecucion de la funcion debounce esta sera otra funcion

    const updateOptions = useCallback(

      debounce( (id, totalQuantity) => {
        instance.put(`/user/updateCart/${id}`, { quantity: totalQuantity })
        .then(data => console.log(data))
        .catch(error => console.log(error))
         
      }, 300),
      
      []

    );


    // al ejecutar la funcion changeQuantityMore cambiaremos nuestro estado
    // setCarrito
    const changeQuantityMore = (id) => {

      setCarrito((previous) => {
        // aqui solamente modificamos la cantidad y el total del producto
        // que coincida con id que se pase como parametro a changeQuantityMore
          const updatedCart = previous.map((product) =>
              product._id === id && product.quantityItem < product.product.quantityMax
                  ? {
                        ...product,
                        quantityItem: product.quantityItem + 1,
                        total: (product.quantityItem + 1) * product.priceItem,
                    }
                  : product
          );
          // luego en el carrito actualizado buscamos aquel producto cuyo id sea 
          // igual a el id que se le pasa como parametro a changeQuantityMore
          const product = updatedCart.find((p) => p._id === id);
          // llamamos a updateOptions esta a su vez llama a nuestro servidor
          // le pasamos como parametro el id y la nueva cantidad a actualizar del producto
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

     
   function debounce(cb, delay = 250) {
  
    let timeout
   
    return (...args) => {

      clearTimeout(timeout)
  
      timeout = setTimeout(() => {
        cb(...args)
      }, delay)
  
    }
  
      
  
   }

  // => 
   

    

  return (
    <div>
        <h2>Cart</h2>
       <div style={{display : 'flex', gap : '1rem'}}>
        {
                carrito?.length > 0 ? (
                    carrito.map(product => (
                        <div style={{border : 'solid coral 1px'}} key={product._id}>
                            <img width={'100px'} height={'80px'} src={product.image} alt="" />
                            <p>{product.name}</p>
                            <p>{product.priceItem}</p>
                            <p>{product.total}</p>
                            <button onClick={() => changeQuantityLess(product._id)}>-</button>
                            <span>{product.quantityItem}</span>
                            <button onClick={() => changeQuantityMore(product._id)}>+</button>
                        </div>
                    ))
                ) : <h2>no hay items </h2>
            }
       </div>
    </div>
  )
}
