/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { instance } from "../libs/axiosConfig";
import { useAuth } from "../context/AuthProvider";
import { useProduct } from "../context/ProductsProvider";
import { ProductGallery } from "../components/ProductGallery";
import { ProductData } from "../components/ProductData";
import {Container } from "@chakra-ui/react";
import { Loading } from "../components/Loading";

 const ProductDetails = () => {
 
    const {id} = useParams()
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState(null)
    const {auth} = useAuth()
    const { carrito, setCarrito } = useProduct()
    const navigate = useNavigate()
 
   useEffect(() => {
        getOneProduct()  
   }, [id])

   const getOneProduct = async () => {
        try {
            const {data} =  await instance.get(`/product/getOneProduct/${id}`)
            console.log(data)
            setProduct(data.product)
        }catch(error){
            console.log(error)
        }
   }

   const addToCart =  async(quantity) => { 
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



   if(!product) return <Loading/>

  return (
    <Container maxW={{base : '100%'}} display={'flex'} flexDirection={{base : 'column', lg : 'row'}} p={{base : '1', lg : '10'}} flexWrap={'wrap'} >

        <ProductGallery images={product.images}/>

        <ProductData 
            product={product} 
            add={addToCart}
            deleteProduct={deleteProduct}
            loading={loading}
        />

    </Container>
  )
}


export default ProductDetails


