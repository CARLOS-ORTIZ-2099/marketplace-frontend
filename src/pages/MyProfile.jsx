import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthProvider"
import { Navigate } from "react-router-dom"


export const MyProfile = () => {

  const {handlerCloseSession, auth} = useAuth()
  const [redirect, setRedirect] = useState(null)
 
 
  useEffect(() => {
    !auth && setRedirect('/login')
  }, [auth])

  if(redirect) {
   return <Navigate to={redirect}/>
  }

  const closeSession = async() => { 
    handlerCloseSession()    
  }  

  return (
    <div>
        <h1>MyProfile</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt quo mollitia magnam laboriosam quasi nesciunt qui fugiat est ut cupiditate doloremque rem iusto nisi nulla, repudiandae exercitationem porro. Velit, exercitationem!</p>
        <button onClick={closeSession}>cerrar session</button> 
    </div>
  )
}
