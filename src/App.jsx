
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
                  <Route path='/login' element={<Login/>}/>
                  <Route path='/cart' element={<Cart/>}/>
                  <Route path='/profile' element={<Profile/>}/>
              </Routes>
          </BrowserRouter>
        </ProductsProvider>
       </AuthProvider>
       
    </>
  )
}

export default App
