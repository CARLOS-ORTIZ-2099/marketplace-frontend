/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider"
import { instance } from "../libs/axiosConfig";


export const Cart = () => {

  const {user} = useAuth()  
  const [carrito, setCarrito] = useState([])  


    useEffect(() => {
        showItemsCart()   
    }, [user])

    const showItemsCart = async() => {
        const {data} = await instance.get(`/user/showCartItems`)
        console.log(data);
        setCarrito(data.response)
    }


    // => 

    // usecallback sirve para "memorizar" una funcion y que esta no se vuelva a crear, en posteriores renderizados
    // esto con el fin de evitar creaciones innesesarias y talvez mantener
    // un referencia a la funcion
    // el segundo parametro que recibe useCallback es un listado de dependencias
    // que si cambian debera de crearse nuevamente muy similar a useEffect
    // la constante updateOptions tendra como valor lo que devuelva la
    // ejecucion de la funcion throttle esta sera otra funcion
    const updateOptions = useCallback(
      throttle( (id, totalQuantity) => {
        instance.put(`/user/updateCart/${id}`, { quantity: totalQuantity })
        .then(data => console.log(data))
        .catch(error => console.log(error))
         
      }, 500),
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
  
          const product = updatedCart.find((p) => p._id === id);
          updateOptions(id, product.quantityItem); // Enviar la cantidad total al servidor
          return updatedCart;

      });

    };


    function throttle(cb, delay = 1000) {

        let shouldWait = false
        let waitingArgs
        
        // funcion con delay
        const timeoutFunc = () => {
          // despues de un tiempo corroboramos el valor de waitingArgs para ver si
          // teien argumentos guardados inicialmente no tiene nada por lo que se cumple la condicion y cambia el valor de shouldWait a false
          // para que el usuario pueda ejecutar nuevamente la llamada al servidor
          // pero en el tiempo de espera el usuario puede manioular nuevamente el boton al hacerlo cambiaria el valor de waitingArgs por ende no se ejecutaria esta funcion
          if (waitingArgs == null) {
            shouldWait = false
          }
          // pero si se ejecutaria esta
          else {
            cb(...waitingArgs)
            waitingArgs = null
            setTimeout(timeoutFunc, delay)
          }
          
        }
      
        return (...args) => {
          
          // aqui corroboramos que si shouldWait es true asignemos a la 
          // variable waitingArgs los argumentos que recibe la funcion
          // que sera un id y cantidad de producto y terminamos la funcion
          // esto significa basicamente no ejecutes la funcion cb(que sera la llamda al servidor) hasta que 
          // shouldwith cambie, esto para evitar llamadas innesesarias al servidor
          if (shouldWait) {
            waitingArgs = args
            return
          }
      
          cb(...args)
          shouldWait = true
          // shouldWait cambia cuando se ejecuta esta funcion, pero esta tiene
          // un delay por lo que el cambio no ocurrira inmediatamente, esto esta bien de esa manera no hacemos tantas llamadas a nuestro servidor
          setTimeout(timeoutFunc, delay)
    
        }
    
    }

    // => 
   




    const changeQuantityLess = (id) => {
        setCarrito(previous => ( previous.map(product => (
            product._id == id && product.quantityItem > 1? 
            {
                ...product,
                quantityItem : product.quantityItem-1,
                total : (product.quantityItem-1)*product.priceItem 
            } 
            : product

        )) ) )
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
