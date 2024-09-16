import { useEffect, useState } from "react"
import {instance} from '../libs/axiosConfig'
import { useAuth } from "../context/AuthProvider"
import { Box } from "@chakra-ui/react"
import { ProductCard } from "../components/ProductCard"
import { Loading } from "../components/Loading"

 const MyPosts = () => {
  const {user, auth} = useAuth()
  const [itemsOfuser, setItemsOfUser] = useState(null)

    useEffect(() => {
      auth && getAllPostUser()
    }, [auth])
     
     const getAllPostUser = async () => {
       try{
        const {data} = await instance.get(`/product/getAllProducts/${user._id}`)
        console.log(data)
        setItemsOfUser(data.products)
       }catch(error){
        console.log(error)
       }    
    }

    if(!itemsOfuser) return <Loading/>

  return (
    <Box display={'flex'} justifyContent={'space-around'} mt={'5'} gap={'5'} flexWrap={'wrap'}>
      {
        itemsOfuser.length > 0 
        ? (
            itemsOfuser.map((item) => (
              <ProductCard key={item._id} product={item}/>
            ))
          )
      : (<Box as="h3" color={'teal'} fontSize={'x-large'}>sin productos</Box>) 
      }
       
    </Box>
  )
}

export default MyPosts
