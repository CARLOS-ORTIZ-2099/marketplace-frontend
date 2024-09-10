/* eslint-disable react-hooks/exhaustive-deps */
import {  useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { instance } from "../libs/axiosConfig";
import { useAuth } from "../context/AuthProvider";
import { useProduct } from "../context/ProductsProvider";
import { ProductGallery } from "../components/ProductGallery";
import { ProductData } from "../components/ProductData";


export const ProductDetails = () => {
 
    const {id} = useParams()
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState(null)
    const {auth} = useAuth()
    const { carrito, setCarrito, setFavourites } = useProduct()
    //console.log(product);
    //console.log(carrito);
    const navigate = useNavigate()
 
    useEffect(() => {
        getOneProduct()  
    }, [id])

    // funcion que trae la info de un producto en especifico segun id de params
    const getOneProduct = async () => {
        try {
            const {data} =  await instance.get(`/product/getOneProduct/${id}`)
            console.log(data);
            setProduct(data.product)
        }catch(error){
            console.log(error)
        }
    }

    const changeQuantityMore = () => setQuantity(previous => previous >= product.quantityMax ? previous : previous+1)
 
    const changeQuantityLess = () => setQuantity(previous => previous <= 1 ? previous :  previous-1)

   const addToCart =  async() => { 
        // si auth es true quiere decir que estamos autenticados y debemos hacer una llamada al servidor
        if(auth) { 
            const itemFound = carrito.find(item => item.product == id || item.product?._id == id)
            console.log(itemFound)   
            if(itemFound && itemFound.quantityItem+quantity > product.quantityMax){
                alert('no puedes agregar mas')
                return
            } 
            setLoading(true)  
            try {
                const {data, status} = await instance.post(`/user/addToCart/${id}`, 
                { quantity}) 
                console.log(data);
               
                // si entra aqui el producto se creo
                status == '201'
                ? setCarrito((previous) => [...previous, data.item]) 
                // si entra aqui solo se actualizo    
                : setCarrito((previous) => (
                    previous.map((product) => product._id == data.item._id 
                        ? {...product, quantityItem : data.item.quantityItem, total : data.item.total}
                        : product   
                    )
                 ))

                setLoading(false)
            }catch(error) {
                console.log(error)
                setLoading(false)
            }
            
        }else {
            alert('debes iniciar sesion primero')
            navigate('/login')
        }
   }

   const handleFavourite = async(boolean) => {
    console.log(boolean);
    if(!auth){
        navigate('/login')
        return
    }
    // si es true lo eliminamos 
    if(boolean){  
        setFavourites((previous) => {
            const data = previous.filter((ele) => ele.product._id != product._id)
            functionFavourite(product._id, {action:'eliminar'})
            return data
        })
    }
    // si es false lo creamos
    else {
        setFavourites((previous) =>{
            let data = [...previous, {product : {...product}}]  
            functionFavourite(product._id, {action :'crear'})
            return data
        }) 
    }

   }

   const deleteProduct = async(id) => {
       const confirmDelete = confirm('deseas eliminar este producto '+ id)
       console.log(confirmDelete);
       if(confirmDelete) {
            try {
            const data = await instance.delete(`/product/deleteProduct/${id}`)
            console.log(data) 
             if(data.status == 200) { 
                alert('eliminado correctamnente')
                navigate('/')
             }
            }catch(error) {
                console.log(error)
                alert('sucedio un error') 
            }
      }
   }


   const functionFavourite = useCallback(debounce((idParam, body) => {
        instance.post(`/user/addToFavorite/${idParam}`, body)
        .then(data => console.log(data.data))
   }, 500 ), [] )

   function debounce(cb, delay) { // => closures : funcion que retorna otra funcion, esto se hace con el fin de mantener un estado privado, donde la funcion hija recuerda el contexto donde fue definida, y por ende puede acceder a los paramteros, valores y variables de su contexto
        let time
        return (id, body) => {

           clearTimeout(time)

           time = setTimeout(() => {
                cb(id, body)
            }, delay)

        }
   }


   if(!product) return <h3>cargando ...</h3>

  return (
    <div>
        <ProductGallery images={product.images}/>

        <ProductData 
            product={product} 
            less={changeQuantityLess} 
            more={changeQuantityMore}
            quantity={quantity}
            add={addToCart}
            deleteProduct={deleteProduct}
            loading={loading}
            handleFavourite={handleFavourite}
        />

    </div>
  )
}


