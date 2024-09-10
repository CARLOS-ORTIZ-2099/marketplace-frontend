/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { instance } from "../libs/axiosConfig"
import { useFormFields } from "../hooks/useFormFields"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"


const initial = {
  name : '',
  description : '',
  price : '',
  quantityMax : '',
  category : '',
  brand : '',
  coin : '',
  state : '',
  deliveryMethod :'',
  warranty : ''

}


export const FormPost = () => {
  const {auth} = useAuth()
  // estado que manipula las fotos
  const [photos, setPhotos] = useState([])
  // estado que manipula las fotos que se van a eliminar 
  const [photosDelete, setPhotosDelete] = useState([]) 
  const { formData, errors, handlerChange, validateErrors, setErrors, setFormData} = useFormFields(initial)

  const {id} = useParams()
  //console.log(id)

  useEffect(() => { 
    if(id && auth) {
      console.log(`hacer peticion al servidor`)
      getOneProduct()
    }
  }, [id])

   // funcion que trae la info de un producto en especifico segun id de params
  const getOneProduct = async () => {
    try {
        const {data} =  await instance.get(`/product/getOneProduct/${id}`)
        console.log(data);
        //setFormData(data.product)
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
      <h2>{header}</h2>
      <p>{description}</p>
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
    
    // si pasamos toda la validacion lo que haremos sera enviar un formdata
    // al servidor con los datos de los imputs y las imagenes
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
          console.log(event)
          //console.log(`${event.type}: ${event.loaded} bytes transferred\n`)
          //console.log(reader.result)
          setPhotos((previous) => [...previous, {file : files[i], result : reader.result, id : event.timeStamp}])

      } )
      
    }
    
  }

  // funcion que se encarga de eliminar una foto tanto de mi estado local como 
  // de cloudinary
  async function removePhoto(e, idPhoto) {
    // recordar que para todas las imagenes tenemos un campo en comun id
    // para poder manipular las imagenes uniformemente independientemente de 
    // que si viene del servidor o del local
    // las imagens que vienen del servidor tendra un id marketplace/m0gnehanlogx4koswn4f que es un string
    // mientras que las imagenes que vienen del local tendran un id en timeStamp que es un number
    console.log(typeof idPhoto, idPhoto)
    // si se cumple viene de la db y lo guardamos en el estado que enviara 
    // al servidor para su posterior eliminacion en cloudinary
    if(typeof idPhoto.id == 'string') {
      setPhotosDelete((previous) => ( [...previous, idPhoto] ))
    }
    // independientemente de que si la foto viene del servidor o es una nueva
    // que viene del local lo quitamos del arreglo del estado de fotos
    setPhotos([...photos.filter(photo =>  {

      return photo.id !== idPhoto.id      

    } )]);

  }

  // aqui lo que hacemos sera posicionar la imagen que se selecciono en primer 
  // lugar y quitarla de donde estaba previamente
  function selectImageMain(file) {
    console.log(file)
    setPhotos([file, ...photos.filter(photo => {
      //console.log(photo)
      return photo.id !== file.id     
    })])
  }

  
  
  

  return (
    <div>
        <h1>CreatePost</h1>  
 

        <form onSubmit={sendData}>

          <input type="submit" value={'send data'} />


          {/* marca producto */}

            { preInput('brand', 'write the real brand of the product or generic if not have brand') }

            <input 
              type="text" 
              placeholder="brand"
              value={formData.brand} 
              onChange={handlerChange}
              name="brand"
            />
            <br/>
            {
              errors.brand && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.brand.message}</p>
            }




         {/* estado de  producto */}


           {
              preInput('state', 'select of appropriate condition for your product and avoid clain from your buyers')
           }

            <label htmlFor="nuevo">nuevo</label>
            <input 
              id="nuevo" 
              type="checkbox"
              name="state"
              onChange={handlerChange}
              checked={formData.state == 'nuevo'}
            />

            <label htmlFor="usado">usado</label>
            <input 
               id="usado" 
               type="checkbox"
               name="state"
               onChange={handlerChange}
               checked={formData.state == 'usado'}
            />

            <label htmlFor="reacondicionado">reacondicionado </label>
            <input 
               id="reacondicionado" 
               type="checkbox"
               name="state"
               onChange={handlerChange}
               checked={formData.state == 'reacondicionado'}
            />

            {
              errors.state && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.state.message}</p>
            }



            {/* nombre de producto */}

            {
              preInput('name', 'include product, brand, model and highlights theirs main features')
            }
            <input 
                type="text" 
                placeholder="name" 
                onChange={handlerChange}
                value={formData.name}
                name="name"
            />

            {
              errors.name && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.name.message}</p>
            }







            {/* fotos de producto */}

            {
              preInput('photos', 'upload good photos for that the  product highlights  ')
            }
            <input 
              type="file"
              placeholder="file"  
              name="images"
              multiple
              onChange={uploadPhoto}
            />


            <div style={{display : 'flex', flexWrap : 'wrap', gap : '1rem', margin : '20px'}}>
              {
                photos.length > 0 && photos?.map((photo) => (
                  <div key={photo.id || photo.public_id}>
                      <img width={'150px'} height={'150px'} 
                        src={photo.result || photo.secure_url} 
                      />
                      <br/>
                      <span 
                        onClick={(e) => removePhoto(e, photo )}>
                        eliminar
                      </span>

                      <p onClick={() => selectImageMain(photo)}>

                      {
                        photo.id === photos[0].id &&(
                          <svg width={'50px'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                            <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                          </svg>

                        )
                      }
                      {
                        photo.id !== photos[0].id &&(
                          <svg width={'50px'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                          </svg>
                        )
                      }


                      
                      </p>

                  </div>
                ))
              }
            </div>
            
            {
              errors.images && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.images.message}</p>
            }







             {/* stock de producto */}

            {
              preInput('stock', 'Indicate how many units you have for sale')
            }
            <input 
                type="number" 
                min={1}
                placeholder="quantityMax"
                onChange={handlerChange}
                value={formData.quantityMax}
                name="quantityMax"
            />
            {
              errors.quantityMax && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.quantityMax.message}</p>
            }


            {/* descripcion de producto */}
            {
              preInput('description', ' details the main features of you product' )
            }
            <textarea 
                placeholder="description"
                onChange={handlerChange}
                value={formData.description}
                name="description"
            >

            </textarea>

            {
              errors.description && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.description.message}</p>
            }





           

             {/* precio de producto */}
 
            {
              preInput('price', 'Indicate how much you want to sell the product for')
            }

            <select name='coin'  onChange={handlerChange}>
              <option  value="">coin select</option>
              <option  value="soles" selected={formData.coin === 'soles'}>S/</option>
              <option  value="dolares" selected={formData.coin === 'dolares'}>US$</option>
            </select>
          
            <input 
                type="number" 
                min={1}
                name="price" 
                placeholder="price"
                //value={price}
                //onChange={(e) => setPrice(e.target.value)}
                onChange={handlerChange}
                value={formData.price}
            />
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
              <select name='category'   onChange={handlerChange}>
                <option  value="">category select</option>
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
              </select>

            {
              errors.category && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.category.message}</p>
            }






            {/* metodo de entrega de producto */}

            {
              preInput('Delivery method', 'choose one')
            }
            <label htmlFor="delivery">delivery</label>

            <input 
              id="delivery" 
              type="checkbox"
              name="deliveryMethod"
              onChange={handlerChange}
              checked={formData.deliveryMethod == 'delivery'} 
              //checked={'delivery' == deliveryMethod} 
            />

            <label htmlFor="presencial">presencial</label>

            <input 
              id="presencial" 
              type="checkbox"
              name="deliveryMethod"
              onChange={handlerChange}
              checked={formData.deliveryMethod == 'presencial'}  
              //checked={'presencial' == deliveryMethod}  
            />

            {
              errors.deliveryMethod && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.deliveryMethod.message}</p>
            }






            {/* garantia de producto */}

            {
              preInput('warranty', 'Indicates the type of guarantee offered.')
            }

            <label htmlFor="garantia-vendedor">garantia del vendedor</label>

            <input 
               id="garantia-vendedor" 
               type="checkbox"
               name="warranty"
               onChange={handlerChange} 
               checked={ formData.warranty == 'garantia-vendedor'}   
               //checked={'garantia vendedor' == warranty}   
            />

            <label htmlFor="garantia-fabrica">garantia de fabrica</label>
           
            <input 
               id="garantia-fabrica" 
               type="checkbox"
               name="warranty"
               onChange={handlerChange} 
               checked={ formData.warranty == 'garantia-fabrica'} 
               //checked={'garantia fabrica' == warranty}   
            />  

            <label htmlFor="sin-garantia">sin garantia</label>

            <input 
              id="sin-garantia" 
              type="checkbox"
              name="warranty"
              onChange={handlerChange}
              checked={ formData.warranty == 'sin-garantia'}
              //checked={'sin garantia' == warranty} 
            />  
            {
              errors.warranty && <p style={{color : 'tomato', fontWeight: 'bolder'}}>{errors.warranty.message}</p>
            }


        </form>

    </div>
  )



}
