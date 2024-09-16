/* eslint-disable no-prototype-builtins */
import { useState } from "react"


export const useFormFields = (initial) => {
    
    const [formData, setFormData] = useState(initial)
    const [errors, setErrors] = useState({})

    
    const handlerChange = (e) => {
      //console.log(e)
      const ev = e.target
      const hasProperty = ev.hasOwnProperty('checked')
      
      setFormData((previous) => (
        {...previous, [ev.name] : hasProperty ? ( ev.checked ? ev.id : '') : (ev.value )}
      ))
    
    }
  
    // esta funcion me ayuda a que los campos de formularios se envian al servidor llenos
    const validateErrors = () => {
        let errAux = {}
        for(let key in formData) {
            !formData[key] ? errAux[key] = {message : `el campo ${key} es requerido`} : null
        }
        return  errAux
    }


    return {    
        formData, 
        errors, 
        handlerChange,
        validateErrors,
        setErrors,
        setFormData
    }

}
