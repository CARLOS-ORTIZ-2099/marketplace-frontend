
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { ProductsProvider } from './context/ProductsProvider'
import { lazy, Suspense } from 'react'


const Home = lazy(() => import ('./pages/Home'))
const ProductDetails = lazy(() => import ('./pages/ProductDetails'))
const Cart = lazy(() => import ('./pages/Cart'))
const Profile = lazy(() => import ('./pages/Profile'))
const MyProfile = lazy(() => import ('./pages/MyProfile'))
const MyFavourites = lazy(() => import ('./pages/MyFavourites'))
const MyPosts = lazy(() => import ('./pages/MyPosts'))
const FormPost = lazy(() => import ('./pages/FormPost'))
const Login = lazy(() => import ('./pages/Login'))
const Register = lazy(() => import ('./pages/Register'))
const Navbar = lazy(() => import ('./components/Navbar'))



const Loading = () => <div>Loading...</div>;

function App() {
  


  return (
    <>
       <AuthProvider>
        <ProductsProvider>

        <Suspense fallback={<Loading/>}>
          <BrowserRouter>
              <Navbar/>
              <Routes>

                <Route path='/' element={<Home/>}/>
                <Route path='/product-details/:id' element={<ProductDetails/>}/>
                <Route path='/cart' element={<Cart/>}/>
                
                {/* rutas protegidas */}
                <Route path='/profile' element={<Profile/>}>
                  <Route index  element={<MyProfile/>}/>
                  <Route path='/profile/myFavourites' element={<MyFavourites/>}/>
                  <Route path='/profile/myPosts' element={<MyPosts/>}/>
                  
                  <Route path='/profile/formPage' element={<FormPost/>}/>
                  <Route path='/profile/formPage/:id' element={<FormPost/>}/>
                </Route>
                

                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/editProfile/:id' element={<Register/>}/>
                  
                  
              </Routes>
          </BrowserRouter>
        </Suspense>

        </ProductsProvider>

       </AuthProvider>
       
    </>
  )
}

export default App
