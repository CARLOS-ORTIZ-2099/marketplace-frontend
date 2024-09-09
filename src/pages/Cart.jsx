/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthProvider"
import { instance } from "../libs/axiosConfig";
import { useProduct } from "../context/ProductsProvider";
import { Link } from "react-router-dom";


export const Cart = () => {

  const {auth} = useAuth()  
  const {showCartItems, carrito, setCarrito} = useProduct()
  //console.log(carrito);
  
    useEffect(() => {
      console.log('carrito actualizado');  
      if(auth) {
        showCartItems()  
      }
           
    }, [auth])


    // al ejecutar la funcion changeQuantityMore cambiaremos nuestro estado
    // setCarrito
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
      const response = await instance.delete(`/user/removeCartProduct/${id}`)
      console.log(response)

      setCarrito( carrito.filter((previous) => (
        previous._id !== id
      )) )

      }catch(error) {
        console.log(error)
      }
   }  
   
   const buyTheOrder = async (id) => {
    try {
      const response = await instance.delete(`/user/buyTheOrder/${id}`)
      console.log(response)

      setCarrito( carrito.filter((previous) => (
        previous._id !== id
      )) )

      }catch(error) {
        console.log(error)
      }
   }

    

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
                            <button disabled={product.quantityItem <=1} 
                             onClick={() => changeQuantityLess(product._id)}>-</button>
                            <span>{product.quantityItem}</span>
                            <button disabled={product.quantityItem >=product.product.quantityMax} onClick={() => changeQuantityMore(product._id)}>+</button>
                            <br/>
                            <button><Link to={`/product-details/${product.product._id}`}>see more</Link></button>

                            <button onClick={() => removeCartProduct(product._id)}>eliminar</button>

                            <button onClick={() => buyTheOrder(product._id)}>comprar</button>

                        </div>
                    ))
                ) : <h2>no hay items </h2>
            }
       </div>
    </div>
  )
}
