/* eslint-disable react-hooks/exhaustive-deps */
import {  useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { instance } from "../libs/axiosConfig";
import { useAuth } from "../context/AuthProvider";
import { useProduct } from "../context/ProductsProvider";


export const ProductDetails = () => {

  /* aqui hacer otra peticion al servidor para recuperar la info del producto
     seleccionado
  */  

    const {id} = useParams()
    //const [product, setProduct] = useState({})
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState(false)
    const {auth, user} = useAuth()
    const { setCarrito, favourites, setFavourites } = useProduct()
    console.log(favourites);
    

    useEffect(() => {
        getOneProduct(id)
    }, [id])

    const getOneProduct = async () => {
        const {data} =  await instance.get(`/product/getOne/${id}`)
        //console.log(data.product);
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
            setLoading(true)
            try {
                const response = await instance.post(`/user/addToCart/${id}`, 
                    { quantity}) 
                console.log(response);
                // despues actualizar los items de nuestro carrito
                response.status == '201'
                ? setCarrito((previous) => [...previous, response.data.message]) 
            
                : setCarrito((previous) => (
                    previous.map((product) => product._id == response.data.message._id 
                        ? {...product, quantityItem : response.data.message.quantityItem, total : response.data.message.total}
                        : product   
                    )
                 ))

                setLoading(false)
            }catch(error) {
                console.log(error)
                setLoading(false)
            }
            
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


    const handleFavourite = async(boolean) => {
        console.log(boolean);
        // si es true lo eliminamos
        if(boolean){
           const filterData = favourites.filter((fv) => fv.product != product._id)
            setFavourites(filterData)
        }
        // si es false lo creamos
        else {
            setFavourites((previous) =>( [...previous, {product :product._id}]))
        }
    }

   function renderButton() {
      return  favourites.find((fv) => fv.product == product._id) 
      ? (
            <button onClick={() => handleFavourite(true)} >
                <svg width={'25px'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
                </svg>

            </button>
        )
        : product.seller !== user._id &&
        (
            <button onClick={() => handleFavourite(false)} >
                <svg width={'25px'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                </svg>


            </button>
        )
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
     
        {
            renderButton()
        }


        <h2> nombre : {product.name}</h2>
        <p>decsripcion: {product.description}</p>
        <p>precio : {product.price}</p>
        <p>cantidad disponible:  {product.quantityMax}</p>
           <div style={{display : 'flex'}}> 
                <button onClick={changeQuantityLess}>-</button>
                    <p>{quantity}</p>
                <button onClick={changeQuantityMore}>+</button>
                <button onClick={addToCart} disabled={loading}>
                agregar al carrito
                </button>
            </div> 
            

    </div>
  )
}