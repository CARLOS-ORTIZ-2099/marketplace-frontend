/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { instance } from "../libs/axiosConfig";
import { useProduct } from "../context/ProductsProvider";


export const Home = () => {

    /* el home de la aplicacion, primero haremos una llamada a nuestra api para que nos traiga todos los productos del marketplace 
  
  */
    const [products, setProducts] = useState([]) 

  
    useEffect(() => {
        getAllProducts()
    }, [])  

    const getAllProducts  =  async() => {
      try{ 
        const {data} = await instance.get('/product/getAll')
        //console.log(data);
        
        setProducts(data.products)  

      }catch(error) {
        console.log(error);
        
      }
  }



  return (
    <div>
        <h1>welcome to home</h1>
       <div style={{display:'flex', gap:'1rem'} }>
       {
          products.map((product) => (
            <div  key={product._id}>
                <h2>{product.name}</h2>
                <img width={'250px'} src={product?.images?.[0].secure_url}  />
                <br/>
                <button><Link to={`/product-details/${product._id}`}>ver mas</Link></button>
            </div>
          ))
       }
       </div>
       
    </div>
  )
}