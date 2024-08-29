import { Link, Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"
import { useEffect, useState } from "react"


export const Navbar = () => {
   const {auth} = useAuth() 
   


 
  

  return (
    <nav>
        <ul>
            <li><Link to={`/`}>home</Link></li>
            <li><Link to={'/cart'}>carrito</Link></li>
            <li><Link to={`/${auth ?'profile' : 'login'}`}>profile</Link></li>
        </ul>
    </nav>
  )


}
