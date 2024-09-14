/* eslint-disable react/prop-types */
import { Checkbox } from "@chakra-ui/react"


export const StateCheckbox = ({handlerChange, formData}) => {

  return (
     <>
        <Checkbox id="nuevo" 
            type="checkbox"
            name="state"
            onChange={handlerChange}
            isChecked={formData.state == 'nuevo'}
        >nuevo 
        </Checkbox>

        <Checkbox id="usado" 
            type="checkbox"
            name="state"
            onChange={handlerChange}
            isChecked={formData.state == 'usado'}
        > usado 
        </Checkbox>

        <Checkbox id="reacondicionado" 
            type="checkbox"
            name="state"
            onChange={handlerChange}
            isChecked={formData.state == 'reacondicionado'}
        > reacondicionado 
        </Checkbox>  
     </>
  )
}
