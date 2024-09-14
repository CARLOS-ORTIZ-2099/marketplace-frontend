/* eslint-disable react/prop-types */
import { Select } from "@chakra-ui/react"


export const CategorySelect = ({handlerChange, formData}) => {
  return (
    <>
        <Select placeholder='category select' borderRadius={'18'}  
        onChange={handlerChange} name='category'>
            <option  
                value="clothes"
                selected={formData.category === 'clothes'}
            >clothes
            </option>  
            <option  
                value="footwear"
                selected={formData.category === 'footwear'}
            >footwear
            </option>
            <option  
                value="technology"
                selected={formData.category === 'technology'}
            >technology
            </option>
            <option  
                value="videogames"
                selected={formData.category === 'videogames'}
            >videogames
            </option>
            <option  
                value="sport"
                selected={formData.category === 'sport'}
            >sport
            </option>
            <option  
                value="others"
                selected={formData.category === 'others'}
            >others
            </option>      
        </Select>
    </>
  )
}
