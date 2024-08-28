import { useEffect, useState } from "react";
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

    const changeQuantityMore = async (id) => {
        // cada vez que el usuario llama a esta funcion tambien se deberia hacer una solicitud al servidor para que actualize el producto en la db
        setCarrito(previous => ( previous.map(product => (
            product._id == id  && product.quantityItem < product.product.quantityMax
            ?{
                ...product,  
                quantityItem : product.quantityItem+1, 
                total : (product.quantityItem+1)*product.priceItem 
             } 
             : product
        )) ) )

        try {
            const response = await instance.put(`/user/updateCart/${id}`, {ope : 'more', quantity : 1})
            console.log(response);
        }catch(error) {
            console.log('entro');
            
            setCarrito((prev) =>
                prev.map((product) =>
                  product._id === id
                    ? {
                        ...product, 
                        quantityItem: product.quantityItem - 1,
                        total: (product.quantityItem - 1) * product.priceItem 
                      }
                    : product
                )
            );
            console.error("Error al actualizar la cantidad", error);
        }
        
       

    }

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
