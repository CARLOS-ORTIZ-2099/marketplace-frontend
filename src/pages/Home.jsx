/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { instance } from "../libs/axiosConfig";
import { Box, Flex } from "@chakra-ui/react";
import { ProductCard } from "../components/ProductCard";
import { Loading } from "../components/Loading";

export const Home = () => {

  const [products, setProducts] = useState(null) 

  useEffect(() => {
    getAllProducts()
  }, [])   

  // funcion que trae todos los productos en venta del marketplace
  const getAllProducts  =  async() => {
      try{  
        const {data} = await instance.get('/product/getAllProducts') 
        setProducts(data.products)  
      }catch(error) {
        console.log(error);
      }
  }

  if(!products) return <Loading/>

  return (
    <div>
      <Flex align={'center'} justify={'space-around'} wrap={'wrap'} gap={'1.5rem'}>
        {
          products?.length > 0 ? 
            products.map((product) => (<ProductCard key={product._id} product={product}/>))
            : <Box color={'#2e7d8c'} fontWeight={'bold'}>no hay productos aun, se el primero en publicar algo</Box>
        }
      </Flex>
    </div>
  )
}
