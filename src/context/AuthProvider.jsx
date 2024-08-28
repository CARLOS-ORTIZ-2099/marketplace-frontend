/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react"
import { instance } from "../libs/axiosConfig"



export const useAuth = () => {
    const auth = useContext(ContextProvider)
    if(!auth) throw new Error('error exists')
    return auth    
}

const ContextProvider = createContext() // creando contexto

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState(false) 
    const [user, setUser] = useState({})
    

    const handlerLogin = async (body) => {
        try {
            //console.log(body);
            const {data} = await instance.post(`/auth/login`, body)
            console.log(data);
            setAuth(true)
            setUser(data.user)
            //una vez que me llegue un resultado satisfactorio borrar el carrito del LS
            localStorage.removeItem('cart')
        }catch(error) {
            console.log(error);
            
        }
        
    }

    const data = {auth, user, setAuth, handlerLogin}

  return (
    <ContextProvider.Provider value={data}>
        {children}
    </ContextProvider.Provider>
  )

}



