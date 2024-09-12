
import { NavbarProfile } from "../components/NavbarProfile"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"
import { useState } from "react"
import { useEffect } from "react"

export const Profile = () => {
  
  const {auth} = useAuth()
  const [redirect, setRedirect] = useState(null)
 
 
  useEffect(() => {
    !auth && setRedirect('/login')
  }, [auth])

  if(redirect) {
   return <Navigate to={redirect}/>
  }



  return (
    <div> 
        {/* <h2>Profile</h2> */}
        <NavbarProfile/>  
        <Outlet/>
    </div>
  )

}
