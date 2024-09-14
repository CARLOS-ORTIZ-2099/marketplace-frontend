/* eslint-disable react-hooks/exhaustive-deps */
import {  useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { instance } from "../libs/axiosConfig";
import { useAuth } from "../context/AuthProvider";
import { useProduct } from "../context/ProductsProvider";
import { ProductGallery } from "../components/ProductGallery";
import { ProductData } from "../components/ProductData";
import {Container } from "@chakra-ui/react";
import { Loading } from "../components/Loading";

export const ProductDetails = () => {
 
    const {id} = useParams()
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState(null)
    const {auth} = useAuth()
    const { carrito, setCarrito, setFavourites } = useProduct()
    const navigate = useNavigate()
 
   useEffect(() => {
        getOneProduct()  
   }, [id])

   const getOneProduct = async () => {
        try {
            const {data} =  await instance.get(`/product/getOneProduct/${id}`)
            setProduct(data.product)
        }catch(error){
            console.log(error)
        }
   }

   const changeQuantityMore = () => setQuantity(previous => previous >= product.quantityMax ? previous : previous+1)
  
   const changeQuantityLess = () => setQuantity(previous => previous <= 1 ? previous :  previous-1)

   const addToCart =  async() => { 
        if(auth) { 
            const itemFound = carrito.find(item => item.product == id || item.product?._id == id)
            if(itemFound && itemFound.quantityItem+quantity > product.quantityMax){
                alert('no puedes agregar mas')
                return
            } 
            setLoading(true)  
            try {
                const {data, status} = await instance.post(`/user/addToCart/${id}`, 
                { quantity})   
                status == '201'
                ? setCarrito((previous) => [...previous, data.item])   
                : setCarrito((previous) => (
                    previous.map((product) => product._id == data.item._id 
                        ? {...product, quantityItem : data.item.quantityItem, total : data.item.total}
                        : product   
                    )
                 ))
                alert('agregado al carrito')
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
    if(boolean){  
        setFavourites((previous) => {
            const data = previous.filter((ele) => ele.product._id != product._id)
            functionFavourite(product._id, {action:'eliminar'})
            return data
        })
    }
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
       if(confirmDelete) {
            try {
            const data = await instance.delete(`/product/deleteProduct/${id}`) 
                if(data.status == 200) { 
                    alert('eliminado correctamente')
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

   function debounce(cb, delay) { 
        let time
        return (id, body) => {

           clearTimeout(time)

           time = setTimeout(() => {
                cb(id, body)
            }, delay)

        }
   }


   if(!product) return <Loading/>

  return (
    <Container maxW={{base : '100%'}} display={'flex'} flexDirection={{base : 'column', lg : 'row'}} p={{base : '1', lg : '10'}} flexWrap={'wrap'} >

        <ProductGallery images={product.images}/>

        <ProductData 
            product={product} 
            less={changeQuantityLess} 
            more={changeQuantityMore}
            quantity={quantity}
            add={addToCart}
            deleteProduct={deleteProduct}
            handleFavourite={handleFavourite}
            loading={loading}
        />

    </Container>
  )
}


