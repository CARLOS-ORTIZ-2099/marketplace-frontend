/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { instance } from "../libs/axiosConfig"
import { useFormFields } from "../hooks/useFormFields"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"
import { Box, Button, Checkbox, FormControl, FormLabel, Image, Input, Select, Text, Textarea } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudArrowUp, faTrash, faImage } from "@fortawesome/free-solid-svg-icons"
import {faImage as imageSecond} from '@fortawesome/free-regular-svg-icons'
import { initial } from "../libs/initialData"


export const FormPost = () => {
  const {auth} = useAuth()
  // estado que manipula las fotos
  const [photos, setPhotos] = useState([])
  // estado que manipula las fotos que se van a eliminar 
  const [photosDelete, setPhotosDelete] = useState([]) 
  const { formData, errors, handlerChange, validateErrors, setErrors, setFormData} = useFormFields(initial)
  const {id} = useParams()

  useEffect(() => { 
    if(id && auth) {
      getOneProduct()
    }
  }, [id])

  const getOneProduct = async () => {
    try {
        const {data} =  await instance.get(`/product/getOneProduct/${id}`)
        for(let key in data.product) {
          if(key != '__v' && key != 'images' &&  key != '_id' &&  key != 'seller') {
            setFormData((pre) => ( {...pre, [key] : data.product[key]} ))
          }
        }
        setPhotos(data.product.images)
    }catch(error){
      console.log(error)
    }
  }

  function preInput(header, description) {
    return <>
      <Box as="h2" color={'teal'} fontWeight={'bolder'}>{header}</Box>
      <Box as="p" color={'teal'} >{description}</Box>
    </>
  }

 
  async function sendData(e) { 
    e.preventDefault()
    // primero validar que todos los campos del formulario esten llenos
     let errorsObject = validateErrors()
     //console.log(errorsObject)
    if(photos.length < 1) {
      errorsObject = {...errorsObject, images : {message : 'selecciona almenos una imagen' } } 
    }

    if( Object.keys(errorsObject).length > 0) {
        console.log(errorsObject)
        setErrors(errorsObject)
        setTimeout(() => {
          setErrors({})
        }, 4000);
        return alert(`todos los campos son obligatorios`)   
    }
    
    const newFormData = new FormData()
 
    // bucle que itera los datos textuales del formulario 
    for(let key in formData) {   
      newFormData.append(key, formData[key])  
    }

    // bucle que itera el arreglo de imagenes del estado
    // aqui validamos si las imagenes tienen la propiedad file significa que son imagenes
    // nuevas que se intentan guardar en el servidor, caso contrario son imagenes que ya
    // estan guardadas en el servidor y son las que permanecen
    const photosRemaind = []
    for(let photo of photos) {
        photo.file ? newFormData.append('images', photo.file)
        : photosRemaind.push(photo)
    }
    // si en el estado de fotos a eliminar hay por lo menos una foto lo mandamos al servidor
    // para su posterior eliminacion 
    photosDelete.length > 0 && newFormData.append('photosDelete', JSON.stringify(photosDelete))
    console.log(photosRemaind)
    // si el arreglo photosRemaind tiene por lo menos 1 imagen quiere decir que esas imagenes
    // no se han eliminado y aun deberian conservarse en la DB
    photosRemaind.length > 0 && newFormData.append('photosRemaind', JSON.stringify(photosRemaind))

    console.log(Object.fromEntries(newFormData))

    // si id existe significa que estamos en modo edicion
    if(id) {
      console.log('go to edit') 
      try {  
        const {data} = await instance.put(`/product/updateProduct/${id}`, newFormData)
        console.log(data)
        //setFormData(initial)
        //setPhotos([])
        alert('se edito el producto')
      }catch(error) {
        console.log(error)
        alert('ocurrio un error')
        setErrors(error.response.data)
        setTimeout(() => {
          setErrors({})
        }, 4000)
      }
    }

    // caso contrario modo creacion
    else {
      try {  
        const response = await instance.post(`/product/createProduct`, newFormData)
        //console.log(response)
        //setFormData(initial)
        setPhotos([])
        alert('se creo el producto')
      }catch(error) {
        console.log(error)
        alert('ocurrio un error')
        setErrors(error.response.data)
        setTimeout(() => {
          setErrors({})
        }, 4000)
      }
    }

  }  

  async function uploadPhoto(e) {
    const files = e.target.files
    //console.log(files)
    for(let i = 0; i < files.length; i++ ) {
      console.log(files[i])
      const reader = new FileReader();
      // Comienza a leer el contenido del archivo especificado
      reader.readAsDataURL(files[i]);
      // se activa cuando una lectura de archivo se completo correctamente
      reader.addEventListener('load', (event) => {
        setPhotos((previous) => [...previous, {file : files[i], result : reader.result, id : event.timeStamp}])
      } )
    }
  }


  async function removePhoto(e, idPhoto) {

    if(typeof idPhoto.id == 'string') {
      setPhotosDelete((previous) => ( [...previous, idPhoto] ))
    }
    setPhotos([...photos.filter(photo =>  {
      return photo.id !== idPhoto.id      
    } )]);

  }


  function selectImageMain(file) {
    setPhotos([file, ...photos.filter(photo => {
      return photo.id !== file.id     
    })])
  }

  
  
  

  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}  minH={'70vh'}>

      <Box  w={{base : '90%', md : '500px'}} >

        <Text fontSize={{base : '3xl', lg : '5xl'}}>{id ? 'update post' : 'create post'}</Text>

        <Box as="form" onSubmit={sendData} sx={{ '& > *': { mt: '10px' } }}>
  
          <Button type="submit" colorScheme="teal" my={'5'} width={'100%'} borderRadius={'18'}>
                {id ? 'update post' : 'create post'}
          </Button>

          {/* marca producto */}

          { preInput('brand', 'write the real brand of the product or generic if not have brand') }
  
          <Input  type='text' placeholder="brand" borderRadius={'18'} value={formData.brand} onChange={handlerChange} name="brand"/>
        
          {
            errors.brand && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.brand.message}</p>
          }


          {/* estado de  producto */}

          {
            preInput('state', 'select of appropriate condition for your product and avoid clain from your buyers')
          }

      
        
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

        {
          errors.state && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.state.message}</p>
        }



        {/* nombre de producto */}

        {
          preInput('name', 'include product, brand, model and highlights theirs main features')
        }
        <Input  type='text' placeholder="brand" borderRadius={'18'} value={formData.name} onChange={handlerChange} name="name"/>

        {
          errors.name && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.name.message}</p>
        }







        {/* fotos de producto */}

        {
          preInput('photos', 'upload good photos for that the  product highlights  ')
        }

          <FormControl >
            <FormLabel cursor="pointer"textAlign={'center'}>
                <Input  type="file" 
                  name="images" 
                  multiple 
                  onChange={uploadPhoto} 
                  display="none" // Oculta el input de archivo
                />
                <Box >
                  <FontAwesomeIcon icon={faCloudArrowUp} size="2xl"/>
                </Box>
                upload  
            </FormLabel> 
    
          </FormControl>

         
        
      
        <Box  /* border={'solid red 2px'} */ display={'flex'} flexWrap={'wrap'} 
          justifyContent={'space-around'} alignItems={'center'} gap={'2'}
        >
          {
            photos.length > 0 && photos?.map((photo) => (
              <Box borderRadius={'18'} key={photo.id || photo.public_id} /* border={'solid blue 2px'} */>
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
        
        {
          errors.images && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.images.message}</p>
        }


        {/* stock de producto */}

        {
          preInput('stock', 'Indicate how many units you have for sale')
        }
        <Input type="number"
          min={1}
          placeholder="quantityMax"
          borderRadius={'18'}
          value={formData.quantityMax}
          onChange={handlerChange}
          name="quantityMax"
        />

        {
          errors.quantityMax && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.quantityMax.message}</p>
        }


        {/* descripcion de producto */}
        {
          preInput('description', ' details the main features of you product' )
        }
        <Textarea
          placeholder="description"
          borderRadius={'18'}
          value={formData.description}
          onChange={handlerChange}
          name="description"
          size='sm'
          resize={'none'}
        />


        {
          errors.description && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.description.message}</p>
        }


        {/* precio de producto */}

        {
          preInput('price', 'Indicate how much you want to sell the product for')
        }

       <Box display={'flex'}>
          <Select placeholder='coin select' borderRadius={'18'}  onChange={handlerChange} name='coin'
              >
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
       {
          errors.coin && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{'selecciona el tipo de moneda'}</p>
        }
        {
          errors.price && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.price.message}</p>
        }

        



          {/* categoria de producto */}
          {
            preInput('category', 'write the category of the product')
          }

          <Select placeholder='category select' borderRadius={'18'}  onChange={handlerChange} name='category'
              >
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
              >   
              technology
              </option>
            <option  
              value="videogames"
              selected={formData.category === 'videogames'}
              >
                videogames
            </option>
            <option  
              value="sport"
              selected={formData.category === 'sport'}
            >
              sport
            </option>
            <option  
              value="others"
              selected={formData.category === 'others'}
            >
              others
            </option>      
          </Select>


        {
          errors.category && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.category.message}</p>
        }


        {/* metodo de entrega de producto */}

        {
          preInput('Delivery method', 'choose one')
        }

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


        {
          errors.deliveryMethod && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.deliveryMethod.message}</p>
        }


        {/* garantia de producto */}

        {
          preInput('warranty', 'Indicates the type of guarantee offered.')
        }

        <Checkbox id="garantia-vendedor" 
          type="checkbox"
          name="warranty"
          onChange={handlerChange}
          isChecked={ formData.warranty == 'garantia-vendedor'}
        >garantia del vendedor 
        </Checkbox>


        <Checkbox id="garantia-fabrica" 
          type="checkbox"
          name="warranty"
          onChange={handlerChange}
          isChecked={ formData.warranty == 'garantia-fabrica'}
        >garantia de fabrica 
        </Checkbox>


        <Checkbox id="sin-garantia" 
          type="checkbox"
          name="warranty"
          onChange={handlerChange}
          isChecked={ formData.warranty == 'sin-garantia'}
        >sin garantia 
        </Checkbox>

        {
          errors.warranty && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.warranty.message}</p>
        }


              
        </Box>
 
      </Box>
        

    </Box>
  )



}
