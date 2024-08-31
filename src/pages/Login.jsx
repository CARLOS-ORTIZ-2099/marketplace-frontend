import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthProvider"
import { Link, Navigate } from "react-router-dom"


export const Login = () => {

  const {handlerLogin, auth} = useAuth()  

   const [email, setEmail]  = useState('carlos1@gmail.com') 
   const [password, setPassword]  = useState('123456') 
   const [redirect, setRedirect] = useState(null)
 

   useEffect(() => {
      auth && setRedirect('/')
   }, [auth])


  const sendData = (e) => {
    e.preventDefault()
    handlerLogin({email, password})
  }


  if(redirect) {
    return <Navigate to={redirect}/>
  }






  return (
    <div>
        <h2>Login</h2>
        <form  onSubmit={sendData}>
            <input type="email"  placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input type="text" placeholder="password" 
                value={password}
                 onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" >login</button>
        </form>
        <button>
            <Link to={'/register'}>no tienes una cuenta? registrate</Link>
        </button>
    </div>
  )
}
