import { useState } from "react"
import { instance } from "../libs/axiosConfig"
import { useFormFields } from "../hooks/useFormFields"




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


export const CreatePost = () => {
  
  const [photos, setPhotos] = useState([])
  const { formData, errors, handlerChange, validateErrors, setErrors, setFormData} = useFormFields(initial)

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
    
    try {  
      const response = await instance.post(`/product/createProduct`, {...formData, images : photos})
      console.log(response)
      setFormData(initial)
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

  function preInput(header, description) {
    return <>
      <h2>{header}</h2>
      <p>{description}</p>
    </>
  }

  

  async function uploadPhoto(e) {
    const files = e.target.files;
    console.log(files)
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('images', files[i]);
    }
    // enviamos las fotos a la endPoint upload, el servidor retornara un arreglo de fotos ya subidos
      instance.post('/product/uploadImages', data) 
      .then(response => {
      const {data:filenames} = response;
      console.log(filenames);
      // aqui cambiamos el valor del estado, sacamos una copia de los elementos previos y le agregamos las nuevas fotos que retorne el servidor
      setPhotos(prev => [...prev, ...filenames]);

    })
  }

  // funcion que se encarga de eliminar una foto tanto de mi estado local como 
  // de cloudinary
  async function removePhoto(e, public_id) {
    let divide =  public_id.split('/')
    let id = divide[divide.length-1]
    console.log(id)
    setPhotos([...photos.filter(photo => photo.public_id !== public_id)]);

    try {
      const response = await instance.delete(`/product/deleteImage/${id}`)
      console.log(response)
    }catch(error){
      console.log(error)
    }

  }


    // aqui lo que hacemos sera posicionar la imagen que se selecciono en primer 
  // lugar y quitarla de donde estaba previamente
  function selectImageMain(file) {
    console.log(file)
    setPhotos([file, ...photos.filter(photo => photo.public_id != file.public_id)])
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
                  <div key={photo.public_id}>
                      <img width={'150px'} height={'150px'} src={photo.secure_url} />
                      <br/>
                      <span 
                        onClick={(e) => removePhoto(e, photo.public_id)}>
                        eliminar
                      </span>

                      <p onClick={() => selectImageMain(photo)}>

                      {
                        photo.public_id === photos[0].public_id &&(
                          <svg width={'50px'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                            <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                          </svg>

                        )
                      }
                      {
                         photo.public_id !== photos[0].public_id &&(
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
              <option  value="soles">S/</option>
              <option  value="dolares">US$</option>
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
                <option  value="clothes">clothes</option>
                <option  value="footwear">footwear</option>
                <option  value="technology">technology</option>
                <option  value="videogames">videogames</option>
                <option  value="sport">sport</option>
                <option  value="others">others</option>
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
