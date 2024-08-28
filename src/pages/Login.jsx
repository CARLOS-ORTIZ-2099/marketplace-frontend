import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthProvider"
import { Navigate } from "react-router-dom"


export const Login = () => {

  const {handlerLogin, auth} = useAuth()  

   const [email, setEmail]  = useState('carlos1@gmail.com') 
   const [password, setPassword]  = useState('123456') 
   const [redirect, setRedirect] = useState(null)
 

   useEffect(() => {
        auth && setRedirect('/')
   }, [auth])

  //console.log(handlerLogin); 
  const sendData = (e) => {
    e.preventDefault()
    const cart = localStorage.getItem('cart') || null
    handlerLogin({email, password, cart})
  }


  if(redirect) {
    //console.log('cambiando');
    
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
    </div>
  )
}
