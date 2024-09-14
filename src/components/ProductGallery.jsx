/* eslint-disable react/prop-types */

import { Box, Grid, GridItem } from "@chakra-ui/react"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";

export const ProductGallery = ({images}) => {

    const [imagesState, setImagesState] = useState(images)
    const [indexImage, setIndexImage] = useState(0)

    const handleImageRight =  () => {
      let sum = indexImage + 1
      if(sum > imagesState.length-1) {
        setIndexImage(0)
        return
      }
      setIndexImage(sum)
    }

    const handleImageLeft = () => {
      let sub = indexImage - 1
      if(sub < 0) {
        setIndexImage(imagesState.length - 1)
        return
      }
      setIndexImage(sub)
    }

    const handleTouchImage = (index) => setIndexImage(index)


  return (
    <Grid  flex={'1 1 0'} templateRows={{base : '1fr', sm : '3fr .5fr'}} templateColumns={{base : '1fr', sm : 'repeat(4, 100px)'}} gap={4} justifyContent={'center'}>
      {/* contenedor de imagen principal */}
      <GridItem rowSpan={1} colSpan={4} position={'relative'}>
        {/* imagen principal */}
        <Box as='img' alt="main-image" src={imagesState[indexImage].secure_url} h={{base : '100%', sm : '450px'}} objectFit={'cover'} borderRadius={10}>
        </Box>

        {/* botones */}
        <Box onClick={handleImageLeft} position={'absolute'} top={'50%'} _hover={{cursor:'pointer'}}>
          <FontAwesomeIcon icon={faChevronLeft} style={{color: "#e0e2e6"}} size="2xl"/>
        </Box>

        <Box onClick={handleImageRight} position={'absolute'} top={'50%'} right={0} _hover={{ cursor:'pointer'}}>
          <FontAwesomeIcon icon={faChevronRight} style={{color: "#e0e2e6"}}size="2xl"/>  
        </Box>

      </GridItem>

      {/* grilla imagenes pequeñas */}   
      {
        images?.slice(0, 4).map((image, index) => (
          <GridItem
            display={{base : 'none', sm:'block'}} 
            key={image.public_id}
            as='img'
            alt="secondImage" 
            src={image.secure_url} 
            colSpan={1}
            h={'100%'} 
            objectFit={'cover'}
            borderRadius={5}
            onClick={() => handleTouchImage(index)}
            _hover={{
              cursor:'pointer'
            }}
          />   
        ))
      }
                
    </Grid>
  )
}
