/* eslint-disable react/prop-types */
import { Box, Input, Select } from "@chakra-ui/react"


export const PriceSelect = ({handlerChange, formData}) => {
  return (
    <>
        <Box display={'flex'}>
            <Select placeholder='coin select' borderRadius={'18'}  onChange={handlerChange} name='coin'>
                <option value="soles" selected={formData.coin === 'soles'}>S/</option>
                <option  value="dolares" selected={formData.coin === 'dolares'}>US$</option>
            </Select>

            <Input type="number"
                min={1}
                placeholder="price"
                borderRadius={'18'}
                value={formData.price}
                onChange={handlerChange}
                name="price"       
            />
        </Box>
    </>
  )
}
