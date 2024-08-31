import { useState } from "react"
import { useAuth } from "../context/AuthProvider"
import { Link } from "react-router-dom"


export const Register = () => {

  const {handlerRegister} = useAuth()  

   const [email, setEmail]  = useState('') 
   const [password, setPassword]  = useState('') 
   const [name, setName]  = useState('') 
   const [lastName, setLastName]  = useState('') 

   

  const sendData = (e) => {
    e.preventDefault()
    handlerRegister({email, password, name, lastName})
  }


  return (
    <div>
        <h2>Registro</h2>
        <form  onSubmit={sendData}>
            <input type="email"  placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input type="text" placeholder="password" 
                value={password}
                 onChange={(e) => setPassword(e.target.value)}
            />
            <input type="name" placeholder="name" 
                value={name}
                 onChange={(e) => setName(e.target.value)}
            />
            <input type="text" placeholder="lastName" 
                value={lastName}
                 onChange={(e) => setLastName(e.target.value)}
            />
            <button type="submit" >registro</button>
        </form>
        <button>
            <Link to={'/login'}>ya tienes una cuenta inicia sesion</Link>
        </button>
    </div>
  )
}
