/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react"
import { instance } from "../libs/axiosConfig"



export const useAuth = () => {
    const auth = useContext(AuthContext)
    if(!auth) throw new Error('error exists')
    return auth    
}

const AuthContext = createContext() // creando contexto

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState(false) 
    const [user, setUser] = useState({}) 
    

    const handlerLogin = async (body) => {
        try {
            //console.log(body);
            const {data} = await instance.post(`/auth/login`, body)
            //console.log(data);
            setAuth(true)
            setUser(data.user)
            //una vez que me llegue un resultado satisfactorio borrar el carrito del LS
            localStorage.removeItem('cart')
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

    const data = {auth, user, setAuth, handlerLogin, handleCloseSession}

  return (
    <AuthContext.Provider value={data}>
        {children}
    </AuthContext.Provider>
  )

}



