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

    // estos estados se compartiran globalmente para toda la app
    const [auth, setAuth] = useState(false) // estado booleano que indica si el usuario esta logueado o no
    const [user, setUser] = useState({}) // este estado contiene la informacion del usuario
    const [errorLogin, setError] = useState({})
    const [errorRegister, setErrorRegister] = useState({})

    // cada que se refresque la pagina llamaremos a verifyAuth
    useEffect(() => {
        verifyAuth()
    }, [])
 
    
    const handlerRegister = async (body) => {
        try {
            await instance.post(`/auth/register`, body)
            alert('creado correctamente')  
        }catch(error) {
            console.log(error);
            setErrorRegister(error.response.data)
            setTimeout(() => setErrorRegister({}), 2000)     
        }
    }

    const handlerLogin = async (body) => {
        try {
            const {data} = await instance.post(`/auth/login`, body) 
            setAuth(true)
            setUser(data.user)
        }catch(error) { 
            setError(error.response.data)
            setTimeout(() => setError({}), 2000)   
        }    
    }
   
    const handlerCloseSession = async () => {
        try {
            const {data} = await instance.post('/auth/closeSession')
            console.log(data);
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
            try{
                const {data} = await instance.get(`/auth/verifyToken`) 
                //console.log(data);
                setAuth(true)
                setUser(data.user)
            }catch(error){  
                console.log(error)
            }
        }   
    }

    const data = {auth, user, errorLogin,errorRegister,  setAuth, handlerLogin, handlerCloseSession, handlerRegister}

  return (
    <AuthContext.Provider value={data}>
        {children}
    </AuthContext.Provider>
  )

}



