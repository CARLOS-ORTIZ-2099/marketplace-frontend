/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import { instance } from "../libs/axiosConfig"
import { useProduct } from "../context/ProductsProvider"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"


export const MyFavourites = () => {

  /* aqui debemos consultar nuestros servidor por los favoritos del usuario
     autenticado o utilizar el valor del estado global de favoritos
  */ 
   const {auth} = useAuth()
  const {favourites, setFavourites, getAllUserFavourites} = useProduct()
  console.log(favourites);
  const [error, setError] = useState(null)  
  const [loading, setLoading] = useState(null)

    useEffect(() => {
      console.log('favoritos actualizados')
      if(auth) {
        getAllUserFavourites()  
      }
          
    }, [auth])

    // funcion que retorna otra funcion, la funcion hija recordara 
    // los valores, variables y parametros del contexto en donde fue 
    // definida es un closure
    function memorize () {    
        let tempo  
        let ind
        return (param = null, index = null) => {
           if(param && (index || index == 0)) {
            tempo = {...param}
            ind = index
           }
           if(!param){
             return {tempo, ind}
           } 
        }
    }

    // memorizamos la funcion memorize para que no se vuelva a recrear aunque el estado se actualize
    const closure = useCallback(memorize(), [])
    


    const handleFavourite = async(product, index) => { 
       try {
        // ejecutamos la funcion closure que es la funcion anidada de memorize
        // le pasamos el producto iterado y su indice esto con el fin de que 
        // el closure "recuerde" o guarde en un estado privado ese producto y
        // su indice si es que llegua a suceder algun error
        closure(product, index)
        setFavourites((previous) => {
             const data = previous.filter((ele) => ele.product._id != product._id) 
             return data
         })
         alert(`eliminado correctamente`)
         setLoading(true) 
         const data = await instance.post(`/user/addToFavorite/${product._id}`, {action : 'eliminar'})
         //console.log(data)

         setLoading(false)
       }catch(error) {
        //console.log(error)
        // si sucede algun error revertimos el efecto
        setError(error)
        setLoading(false)
       }

    }  

    // efecto que se ejecutara cuando suceda algun error

    useEffect(() => {
        // aqui ejecutamos la funcion closure sin parametros entonces 
        // retornara los valores que aun conserva en su memoria 
        // que son tempo(el producto) e ind(el indice) valores en donde
        // se detecto el error al eliminar
        let {tempo, ind} = closure()
        console.log(tempo, ind)

        // aqui vamos a revertir nuestro estado a su valor original 
        // conservando las mismas posiciones donde estaban antes
        const favouritesUpdated = []
        for(let i = 0; i < favourites.length; i++) {
            // primer caso donde el indice del elemento eliminado es igual al indice
            // de algun elemento del estado de favourites
            // entonces insertamos el producto memorizado primero
            if(ind == i) {
                favouritesUpdated.push({product : tempo})
            }
            favouritesUpdated.push(favourites[i])
        }
        // este es el caso donde el indice memorizado es mayor que la 
        // longitud del arreglo, lo insertamos de ultimo
        while(ind >= favourites.length) {
            favouritesUpdated.push({product : tempo})
            ind--
        }

        console.log(favouritesUpdated)
        // finalmente seteamos el estado
        setFavourites(favouritesUpdated)
    }, [error])


  return (
    <div>
        <h1>MyFavourites</h1> 
        {
            favourites?.map(({product}, index) => ( 
                <div key={product._id}>
                    <h1>{product.name}</h1>
                     <img width={'150px'} height={'100px'}src={`${product?.images[0].secure_url}`} alt="" />
                     <br/>
                     <button>
                        <Link to={`/product-details/${product._id}`}>ver mas</Link>
                     </button>
                     <button disabled={loading} onClick={() => handleFavourite(product, index)}>eliminar de favoritos</button>
                </div>
            ))
        }
        
    </div>
  )
}
