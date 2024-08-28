import {  useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { instance } from "../libs/axiosConfig";
import { useAuth } from "../context/AuthProvider";


export const ProductDetails = () => {

  /* aqui hacer otra peticion al servidor para recuperar la info del producto
     seleccionado
  */  

    const {id} = useParams()
    //console.log(id);
    const [product, setProduct] = useState({})
    const [quantity, setQuantity] = useState(1)
    const {auth} = useAuth()
    //console.log(auth);
    

    useEffect(() => {
        getOneProduct()
    }, [id])

    const getOneProduct = async () => {
        const {data} =  await instance.get(`/product/getOne/${id}`)
        console.log(data.product);
        setProduct(data.product)
    }

    const changeQuantityMore = () => {
        setQuantity(previous => previous >= product.quantityMax ? previous : previous+1)
    }

    const changeQuantityLess = () => {
        setQuantity(previous => previous <= 1 ? previous :  previous-1)
    }

    const addToCart =  async() => {
        if(auth) { 
           /*  const currentProduct = {name : product.name, 
                image : product.images[0].secure_url,
                price : product.price,
                quantityMax : product.quantityMax
            } */
            
            // mandar al servidor el carrito de LS
            console.log('enviando al servidor'); 
            const data = await instance.post(`/user/addToCart/${id}`, 
                { quantity}) 
            console.log(data);
            
        }
        else {
            // caso contrario mandar al LS
           let cart = JSON.parse(localStorage.getItem('cart')) || {}
           //console.log(cart[product._id]);
           // si no existe lo creamos
           if(!cart[product._id]) { 
                console.log('no existe')
                cart[product._id] = 
                { 
                  priceItem : product.price, 
                  //quantityMax : product.quantityMax,
                  user : '66c4c0dbf02553850c85abec', 
                  quantityItem : quantity > product.quantityMax 
                  ? 1 : quantity,
                  image : product.images[0].secure_url,
                  name : product.name,
                  total : product.price*(quantity > product.quantityMax 
                  ? 1 : quantity),
                  product : product._id

                } 
                 
           }else {
                let res = (cart[product._id].quantity+quantity) > product.quantityMax
                res ? alert('no puedes agregar mas') : 
                cart[product._id] = {...cart[product._id], 
                    quantityItem :cart[product._id].quantityItem+=quantity, 
                    total : (cart[product._id].quantityItem) * cart[product._id].priceItem
                }
           }
           console.log(cart);
           localStorage.setItem('cart', JSON.stringify(cart)) 
        }
        
    }

   

  return (
    <div>
        <div style={{display : 'flex', gap : '1rem'}}>
            {
                product?.images?.map(image => (
                    <div key={image.public_id}>
                        <img width={'250px'} src={image.secure_url} alt="" />
                    </div>
                ))
            }
        </div>
        <h2> nombre : {product.name}</h2>
        <p>decsripcion: {product.description}</p>
        <p>precio : {product.price}</p>
        <p>cantidad disponible:  {product.quantityMax}</p>
           <div style={{display : 'flex'}}> 
                <button onClick={changeQuantityLess}>-</button>
                    <p>{quantity}</p>
                <button onClick={changeQuantityMore}>+</button>
                <button onClick={addToCart}>agregar al carrito</button>
            </div> 
            

    </div>
  )
}
