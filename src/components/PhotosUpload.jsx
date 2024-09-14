/* eslint-disable react/prop-types */
import { Box, FormControl, FormLabel, Image, Input } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudArrowUp, faTrash, faImage } from "@fortawesome/free-solid-svg-icons"
import {faImage as imageSecond} from '@fortawesome/free-regular-svg-icons'

export const PhotosUpload = ({uploadPhoto, photos, removePhoto, selectImageMain}) => {
  return (
    <>
        <FormControl >
            <FormLabel cursor="pointer"textAlign={'center'}>
                <Input  type="file" 
                    name="images" 
                    multiple 
                    onChange={uploadPhoto} 
                    display="none" 
                />
                <Box >
                    <FontAwesomeIcon icon={faCloudArrowUp} size="2xl"/>
                </Box>
                upload  
            </FormLabel> 
        </FormControl>
      
        <Box display={'flex'} flexWrap={'wrap'} justifyContent={'space-around'} 
            alignItems={'center'} gap={'2'}>
            {
                photos.length > 0 && photos?.map((photo) => (
                    <Box borderRadius={'18'} key={photo.id || photo.public_id}>
                        <Image
                            boxSize='100px'
                            objectFit='cover'
                            alt='image' 
                            borderRadius={'18'}
                            src={photo.result || photo.secure_url} 
                        />
                        
                        <Box display={'flex'} justifyContent={'space-around'} alignItems={'center'}> 
                            <FontAwesomeIcon icon={faTrash}
                                onClick={(e) => removePhoto(e, photo )} 
                                size="lg"
                            />
                            <Box as="span" onClick={() => selectImageMain(photo)}>
                                {
                                    photo.id === photos[0].id &&(
                                    <FontAwesomeIcon icon={faImage} size="lg"/>
                                    )
                                }
                                {
                                    photo.id !== photos[0].id &&(
                                    <FontAwesomeIcon icon={imageSecond} size="lg"/>
                                    )
                                }
                            </Box>
                        </Box>
                    </Box>
                ))
            }
        </Box>
    </>
  )
}
