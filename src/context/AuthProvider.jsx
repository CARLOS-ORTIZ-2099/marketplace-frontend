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
    const [errorLogin, setError] = useState({})
    const [errorRegister, setErrorRegister] = useState({})
    const [updated, setUpdated] = useState(false)

    useEffect(() => {
        verifyAuth()
    }, [])
 
    
    const handlerEditUser = async (body, id) => {
        try {
            const {data} = await instance.put(`/auth/updateUser/${id}`, body)
            alert('editado correctamente')  
            setUser(data)
            setUpdated(true)
        }catch(error) {
            console.log(error);
            setErrorRegister(error.response.data)
            setTimeout(() => setErrorRegister({}), 2000)   
        }
    }

    const handlerEditAvatar = async (body, id) => {
        try {
            const {data} = await instance.put(`/auth/updateUser/avatar/${id}`, body)
            console.log(data)
            setUser({...user, avatar : data.avatar})
        }catch(error) {
            console.log(error);
        }
    }


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
        if(cookie) {    
            try{
                const {data} = await instance.get(`/auth/verifyToken`) 
                setAuth(true)
                setUser(data.user)
            }catch(error){  
                console.log(error)
            }
        }   
    }

    const data = {
        auth, 
        user, 
        errorLogin,
        errorRegister,  
        updated,
        setAuth, 
        handlerLogin, 
        handlerCloseSession, 
        handlerRegister, 
        handlerEditUser,
        setUpdated,
        handlerEditAvatar
    }

  return (
    <AuthContext.Provider value={data}>
        {children}
    </AuthContext.Provider>
  )

}



