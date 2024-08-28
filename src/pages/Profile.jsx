import { instance } from "../libs/axiosConfig"


export const Profile = () => {
 
  const closeSession = async() => {
    const response = await instance.post('/auth/close')
    console.log(response);
    
  }

  return (
    <div>
        <h2>Profile</h2>
        <button onClick={closeSession}>cerrar session</button>
    </div>
  )
}
