import { useState } from "react"


export const useFormAuth = (initial) => {
    
    const [formData, setFormData] = useState(initial)

    const handlerChange = ({target}) => {
        setFormData((previous) => ( {...previous, [target.name] : target.value} ))
    }

    const validateErrors = () => {
        let isValid = true
        for(let key in formData) {
            if(!formData[key]) {
                isValid = false
                break
            }
        }
        return isValid
    }
  
    return { 
        formData, 
        handlerChange,
        validateErrors,
        setFormData 
    }
}
