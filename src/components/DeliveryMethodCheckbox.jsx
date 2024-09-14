/* eslint-disable react/prop-types */
import { Checkbox } from "@chakra-ui/react"


export const DeliveryMethodCheckbox = ({handlerChange, formData}) => {
  return (
    <>
        <Checkbox id="delivery" 
            type="checkbox"
            name="deliveryMethod"
            onChange={handlerChange}
            isChecked={formData.deliveryMethod == 'delivery'}
        >delivery 
        </Checkbox>

        <Checkbox id="presencial" 
            type="checkbox"
            name="deliveryMethod"
            onChange={handlerChange}
            isChecked={formData.deliveryMethod == 'presencial'}
        >presencial 
        </Checkbox>
    </>
  )
}
