import { Spinner } from "@chakra-ui/react"


export const Loading = () => {
  return (
    <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='#2e7d8c'
        size='xl'
        display={'block'}
        mx={'auto'}
    />
  )
}
