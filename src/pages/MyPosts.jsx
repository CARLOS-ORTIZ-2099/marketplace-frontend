import { useEffect, useState } from "react"
import {instance} from '../libs/axiosConfig'
import { useAuth } from "../context/AuthProvider"
import { Box } from "@chakra-ui/react"
import { ProductCard } from "../components/ProductCard"

export const MyPosts = () => {
  const {user, auth} = useAuth()
  const [itemsOfuser, setItemsOfUser] = useState([])

    useEffect(() => {
      auth && getAllPostUser()

    }, [auth])
     
     const getAllPostUser = async () => {
       try{
        const {data} = await instance.get(`/product/getAllProducts/${user._id}`)
        setItemsOfUser(data.products)
       }catch(error){
        console.log(error)
       }    
    }

  return (
    <Box display={'flex'} justifyContent={'space-around'} mt={'5'} gap={'5'} flexWrap={'wrap'}>
      {
        itemsOfuser.length > 0 
        ? (
            itemsOfuser.map((item) => (
              <ProductCard key={item._id} product={item}/>
            ))
          )
        : (<h3>sin productos</h3>) 
      }
       
    </Box>
  )
}
