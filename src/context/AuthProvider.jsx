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
    
    // cada que se refresque la pagina llamaremos a verifyAuth
    useEffect(() => {
        verifyAuth()
    }, [])
 
    
    const handlerRegister = async (body) => {
        try {
            const data = await instance.post(`/auth/register`, body)
            console.log(data);
            
        }catch(error) {
            console.log(error);   
        }
    }



    const handlerLogin = async (body) => {
        try {
            const {data} = await instance.post(`/auth/login`, body) 
            setAuth(true)
            //console.log(data);
            setUser(data.user)
        }catch(error) {
            console.log(error);    
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


    // esta funcion consultara al servidor y enviara un token si existe, si el token es valido
    // el servidor traera los datos del usuario, para volver a setear estos estados
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

    const data = {auth, user, setAuth, handlerLogin, handlerCloseSession, handlerRegister}

  return (
    <AuthContext.Provider value={data}>
        {children}
    </AuthContext.Provider>
  )

}



