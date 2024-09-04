/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import { instance } from "../libs/axiosConfig"
import { useProduct } from "../context/ProductsProvider"
import { Link } from "react-router-dom"


export const MyFavourites = () => {

  /* aqui debemos consultar nuestros servidor por los favoritos del usuario
     autenticado o utilizar el valor del estado global de favoritos
  */ 
  //const [productTempo, setProductTempo] = useState({})  
  const {favourites, setFavourites} = useProduct()
  console.log(favourites);
  const [error, setError] = useState(null)  
  const [loading, setLoading] = useState(null)

/*   useEffect(() => {
    getAllUserFavourites()
  }, [])  

  const getAllUserFavourites = async () =>{ 
    try{
        const {data} = await instance.get('/user/getAllUserFavourites')
        console.log(data)
    }catch(error){
        console.log(error);
        
    }
  } */
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

    const closure = useCallback(memorize(), [])
    


    const handleFavourite = async(product, index) => { 
       try {
        //console.log(product, index)
        closure(product, index)
        setFavourites((previous) => {
             const data = previous.filter((ele) => ele.product._id != product._id) 
             return data
         })
         alert(`eliminado correctamente`)
         setLoading(true) 
         const data = await instance.post(`/user/addToFavorite/${product._id}`, {action : 'eliminar'})
         //console.log(data)
         //alert(`eliminado correctamente ${data.status}`)
         setLoading(false)
       }catch(error) {
        //console.log(error)
        // si sucede algun error revertimos el efecto
        //setFavourites((previous) => [{product : closure() }, ...previous, ])
        setError(error)
        setLoading(false)
       }

    }  

    useEffect(() => {
        let {tempo, ind} = closure()
        console.log(tempo, ind)
        //favourites.forEach(ele => console.log(ele))
        const favouritesUpdated = []
        for(let i = 0; i < favourites.length; i++) {
            // primer caso donde el indice del elemento eliminado es igual al inidce
            // de algun elemento del estado de favourites
            if(ind == i) {
                favouritesUpdated.push({product : tempo})
            }
            favouritesUpdated.push(favourites[i])
        }
        while(ind >= favourites.length) {
            favouritesUpdated.push({product : tempo})
            ind--
        }

        console.log(favouritesUpdated)
        setFavourites(favouritesUpdated)
    }, [error])


  return (
    <div>
        <h1>MyFavourites</h1> 
        {
            favourites.map(({product}, index) => ( 
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
