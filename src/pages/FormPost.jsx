/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { instance } from "../libs/axiosConfig"
import { useFormFields } from "../hooks/useFormFields"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"
import { Box, Button, Input, Text, Textarea } from "@chakra-ui/react"
import { initial } from "../libs/initialData"
import { StateCheckbox } from "../components/StateCheckbox"
import { PhotosUpload } from "../components/PhotosUpload"
import { PriceSelect } from "../components/PriceSelect"
import { CategorySelect } from "../components/CategorySelect"
import { DeliveryMethodCheckbox } from "../components/DeliveryMethodCheckbox"
import { WarrantyCheckbox } from "../components/WarrantyCheckbox"


export const FormPost = () => {
  const {auth} = useAuth()
  // estado que manipula las fotos
  const [photos, setPhotos] = useState([])
  // estado que manipula las fotos que se van a eliminar 
  const [photosDelete, setPhotosDelete] = useState([]) 
  const [loading, setLoading] = useState(false)
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
    if(photos.length < 1) {
      errorsObject = {...errorsObject, images : {message : 'selecciona almenos una imagen' } } 
    }

    if( Object.keys(errorsObject).length > 0) {
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
    // fotos sobrantes antes de enviar al servidor
    const photosRemaind = []
    for(let photo of photos) {
        photo.file ? newFormData.append('images', photo.file)
        : photosRemaind.push(photo)
    }
    // si en el estado de fotos a eliminar hay por lo menos una foto lo mandamos al servidor
    // para su posterior eliminacion 
    photosDelete.length > 0 && newFormData.append('photosDelete', JSON.stringify(photosDelete))

    // si el arreglo photosRemaind tiene por lo menos 1 imagen quiere decir que esas imagenes
    // no se han eliminado y aun deberian conservarse en la DB
    photosRemaind.length > 0 && newFormData.append('photosRemaind', JSON.stringify(photosRemaind))

    //console.log(Object.fromEntries(newFormData))

    setLoading(true)
    // si id existe significa que estamos en modo edicion
    if(id) {
      try {  
        await instance.put(`/product/updateProduct/${id}`, newFormData)
        setFormData(initial)
        setPhotos([])
        alert('se edito el producto')
      }catch(error) {
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
        await instance.post(`/product/createProduct`, newFormData)
        setFormData(initial)
        setPhotos([])
        alert('se creo el producto')
      }catch(error) {
        alert('ocurrio un error')
        setErrors(error.response.data)
        setTimeout(() => {
          setErrors({})
        }, 4000)
      }
    }
    setLoading(false)
  }  

  async function uploadPhoto(e) {
    const files = e.target.files
    for(let i = 0; i < files.length; i++ ) {
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
    setPhotos( [...photos.filter(photo => photo.id !== idPhoto.id )] );
  }

  function selectImageMain(file) {
    setPhotos( [ file, ...photos.filter(photo => photo.id !== file.id ) ] )
  }

  
  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}  minH={'70vh'}>
      <Box  w={{base : '90%', md : '500px'}} >

        <Text fontSize={{base : '3xl', lg : '5xl'}}>{id ? 'update post' : 'create post'}</Text>

        <Box as="form" onSubmit={sendData} sx={{ '& > *': { mt: '10px' } }}>
  
          <Button type="submit" colorScheme="teal" my={'5'} width={'100%'} borderRadius={'18'} isLoading={loading}>
            {id ? 'update post' : 'create post'}
          </Button>

          {/* marca producto */}
            { preInput('brand', 'write the real brand of the product or generic if not have brand') }
            <Input  type='text' placeholder="brand" borderRadius={'18'} value={formData.brand} onChange={handlerChange} name="brand"/>
            {
              errors.brand && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.brand.message}</p>
            }


          {/* estado de  producto */}
            { preInput('state', 'select of appropriate condition for your product and avoid clain from your buyers') }
            <StateCheckbox handlerChange={handlerChange} formData={formData}/>
            {
              errors.state && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.state.message}</p>
            }


          {/* nombre de producto */}
            { preInput('name', 'include product, brand, model and highlights theirs main features') }
            <Input  type='text' placeholder="name" borderRadius={'18'} value={formData.name} onChange={handlerChange} name="name"/>
            {
              errors.name && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.name.message}</p>
            }


          {/* fotos de producto */}
            { preInput('photos', 'upload good photos for that the product highlights') }
            <PhotosUpload uploadPhoto={uploadPhoto} photos={photos}
              removePhoto={removePhoto} selectImageMain={selectImageMain}/>
            {
              errors.images && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.images.message}</p>
            }


          {/* stock de producto */}
            { preInput('stock', 'Indicate how many units you have for sale') }
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
            { preInput('description', ' details the main features of you product') }
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
            { preInput('price', 'Indicate how much you want to sell the product for') }
            <PriceSelect handlerChange={handlerChange} formData={formData}/>
            {
              errors.coin && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{'selecciona el tipo de moneda'}</p>
            }
            {
              errors.price && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.price.message}</p>
            }


          {/* categoria de producto */}
            { preInput('category', 'write the category of the product') }
            <CategorySelect handlerChange={handlerChange} formData={formData}/>
            {
              errors.category && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.category.message}</p>
            }

          {/* metodo de entrega de producto */}
            { preInput('Delivery method', 'choose one') }
            <DeliveryMethodCheckbox handlerChange={handlerChange} formData={formData}/>
            {
              errors.deliveryMethod && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.deliveryMethod.message}</p>
            }


          {/* garantia de producto */}
            { preInput('warranty', 'Indicates the type of guarantee offered.') } 
            <WarrantyCheckbox handlerChange={handlerChange} formData={formData}/>
            {
              errors.warranty && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.warranty.message}</p>
            }
 
        </Box>
 
      </Box>     
    </Box>
  )

}
