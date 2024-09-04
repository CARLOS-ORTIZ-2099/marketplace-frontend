
import { NavbarProfile } from "../components/NavbarProfile"
import { Outlet } from "react-router-dom"

export const Profile = () => {
  

  return (
    <div> 
        <h2>Profile</h2>
         <NavbarProfile/>  
        <Outlet/>
    </div>
  )

}
