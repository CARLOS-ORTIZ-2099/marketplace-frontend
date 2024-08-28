import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"


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
