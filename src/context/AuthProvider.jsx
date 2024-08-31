/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react"
import { instance } from "../libs/axiosConfig"
import jsCookie from 'js-cookie'


export const useAuth = () => {
    const auth = useContext(AuthContext)
    if(!auth) throw new Error('error exists')
    return auth    
}

const AuthContext = createContext() // creando contexto

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState(false) 
    const [user, setUser] = useState({}) 
    

    useEffect(() => {
        verifyAuth()
    }, [])
 

    const handlerLogin = async (body) => {
        try {
            const {data} = await instance.post(`/auth/login`, body)
            setAuth(true)
            console.log(data);
            setUser(data.user)
            //una vez que me llegue un resultado satisfactorio borrar el carrito del LS
            localStorage.removeItem('cart')
        }catch(error) {
            console.log(error);
            
        }
        
    }
 
    const handlerRegister = async (body) => {
        try {
            const data = await instance.post(`/auth/register`, body)
            console.log(data);
            
        }catch(error) {
            console.log(error);
            
        }
    }

    const handleCloseSession = async () => {
        try {
            const response = await instance.post('/auth/close')
            //console.log(response);
            setAuth(false)
            setUser({})
        }catch(error) {
            console.log(error)
        }
    }


    const verifyAuth = async() => {
        const cookie = jsCookie.get('token-market')
        // si la cookie existe consultar
        if(cookie) {
           const {data} = await instance.get(`/auth/verifyToken`) 
           //console.log(data);
           setAuth(true)
           setUser(data)
        }   
    }

    const data = {auth, user, setAuth, handlerLogin, handleCloseSession,handlerRegister}

  return (
    <AuthContext.Provider value={data}>
        {children}
    </AuthContext.Provider>
  )

}



