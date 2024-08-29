import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthProvider"
import { Navigate } from "react-router-dom"


export const Profile = () => {
 
  const {handleCloseSession, auth} = useAuth()
  const [redirect, setRedirect] = useState(null)
 

  useEffect(() => {
       !auth && setRedirect('/login')
  }, [auth])



 if(redirect) {
   //console.log('cambiando');
   
   return <Navigate to={redirect}/>
 }



  const closeSession = async() => { 
    handleCloseSession()
    
  }

  return (
    <div>
        <h2>Profile</h2>
        <button onClick={closeSession}>cerrar session</button>
    </div>
  )
}
