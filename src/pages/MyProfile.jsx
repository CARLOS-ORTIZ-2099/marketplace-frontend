import { useAuth } from "../context/AuthProvider"


export const MyProfile = () => {

  const {handlerCloseSession, user} = useAuth()
 

  const closeSession = async() => { 
    // esta funcion setea el estado de auth a false
    // el componente padre tiene acceso al estado global auth
    // detecta esa cambio a false y no redirigira al login
    handlerCloseSession()    
  }  

  return (
    <div>
        <h1>MyProfile</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt quo mollitia magnam laboriosam quasi nesciunt qui fugiat est ut cupiditate doloremque rem iusto nisi nulla, repudiandae exercitationem porro. Velit, exercitationem!

        </p>
        <h1>{user.name} {user.lastName} {user.email}</h1>
        <button onClick={closeSession}>cerrar session</button> 
    </div>
  )
}
