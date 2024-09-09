import { useEffect, useState } from "react"
import {instance} from '../libs/axiosConfig'
import { useAuth } from "../context/AuthProvider"
import { Link } from "react-router-dom"

export const MyPosts = () => {
  const {user, auth} = useAuth()
  const [itemsOfuser, setItemsOfUser] = useState([])
  /* apenas carge la pagina hacer una consulta al servidor y traerme los
     post creados por el usuario autenticado
  */


     useEffect(() => {
      auth && getAllPostUser()

     }, [auth])
     

     const getAllPostUser = async () => {
       try{
        const {data} = await instance.get(`/product/getAllProducts/${user._id}`)
        console.log(data);
        setItemsOfUser(data.products)
       }catch(error){
        console.log(error)
       }
        
    }

  return (
    <div>
        <h1>MyPosts</h1>
        <div>
            {
              itemsOfuser.length > 0 
              ? (
                  itemsOfuser.map((item) => (
                    <div  key={item._id}>
                      <h2>{item.name}</h2>
                      <img width={'250px'} src={item?.images?.[0].secure_url}  />
                      <br/>
                      <button><Link to={`/product-details/${item._id}`}>ver mas</Link></button>
                    </div>
                  ))
                )
              : (<h3>sin productos</h3>) 
            }
        </div>
    </div>
  )
}
