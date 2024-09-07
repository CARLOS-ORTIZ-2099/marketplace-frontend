
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import { Home } from './pages/Home'
import { ProductDetails } from './pages/ProductDetails'
import { AuthProvider } from './context/AuthProvider'
import { Login } from './pages/Login'
import { Navbar } from './components/Navbar'
import { Profile } from './pages/Profile'
import { Cart } from './pages/Cart'
import { ProductsProvider } from './context/ProductsProvider'
import { Register } from './pages/Register'
import { MyPosts } from './pages/MyPosts'
import { MyFavourites } from './pages/MyFavourites'
import { CreatePost } from './pages/CreatePost'
import { MyProfile } from './pages/MyProfile'



function App() {
  


  return (
    <>
       <AuthProvider>
        <ProductsProvider>
          <BrowserRouter>
              <Navbar/>
              <Routes>

                <Route path='/' element={<Home/>}/>
                <Route path='/product-details/:id' element={<ProductDetails/>}/>
                <Route path='/cart' element={<Cart/>}/>
                
              
                <Route path='/profile' element={<Profile/>}>
                  <Route index  element={<MyProfile/>}/>
                  <Route path='/profile/myPosts' element={<MyPosts/>}/>
                  <Route path='/profile/myFavourites' element={<MyFavourites/>}/>
                  <Route path='/profile/formPage' element={<CreatePost/>}/>
                  <Route path='/profile/formPage/:id' element={<CreatePost/>}/>
                </Route>
                

                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                  
                  
              </Routes>
          </BrowserRouter>
        </ProductsProvider>
       </AuthProvider>
       
    </>
  )
}

export default App
