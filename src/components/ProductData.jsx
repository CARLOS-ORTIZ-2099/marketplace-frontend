/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useProduct } from "../context/ProductsProvider";
import { Button } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";


export const ProductData = ({product, less, more, quantity, add, loading, deleteProduct, handleFavourite}) => {
  
  const {user} = useAuth()  
  const { favourites } = useProduct()

  function renderButton() { 
    return  favourites.find((fv) => fv?.product._id == product._id) 
    ? (
          <Button  onClick={() => handleFavourite(true)} >
              <FontAwesomeIcon icon={faBagShopping} style={{color: "#1c65e3",}} />
          </Button>
      )
      : product.seller !== user._id &&
      (
          <Button onClick={() => handleFavourite(false)} >
              <FontAwesomeIcon icon={faBagShopping} style={{color: "#000000",}} />
          </Button>
      )
  }


  return (
    <div>
          {
            renderButton()
          }

         <h2> nombre : {product.name}</h2>
        <p>decsripcion: {product.description}</p>
        <p>precio : {product.price}</p>
        <p>cantidad disponible:  {product.quantityMax}</p> 
           <div style={{display : 'flex'}}> 
                {
                    product.seller === user._id 
                    ? (
                        <>
                            <button onClick={() => deleteProduct(product._id)}>eliminar producto</button>
                            <button ><Link to={`/profile/formPage/${product._id}`}>editar producto producto</Link></button>
                        </>
                    )
                     : (
                        <>
                            <button onClick={less}>-</button>
                            <p>{quantity}</p>
                            <button onClick={more}>+</button>
                            <button onClick={add} disabled={loading || product.quantityMax === 0}>
                            agregar al carrito
                            </button>
                        </>
                     )
                }
                

           </div> 

    </div>
  )
}
