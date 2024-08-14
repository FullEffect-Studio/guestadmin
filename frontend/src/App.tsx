import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import ProtectedRoutes from './components/auth/ProtectedRoutes'
import Mainy from './Mainy'
import DefaultRoutes from './components/auth/DefaultRoutes'
import Login from './components/auth/Login'
import { Backdrop, CircularProgress } from '@mui/material'
import { APIContext } from './Contexts'

const App = () => {
  const [preloader, setPreloader] = React.useState<boolean>(false)

  setTimeout(()=>{
    setPreloader(true)
  },3000)
  const context = React.useContext(APIContext)
  if(!context){
    throw new Error("No context")
  }
  const {paymentDetails} = context;
  return (
    <div style={{overflow:"hidden"}}>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/cms/*" element={<Mainy />} />
        </Route>
        <Route element={<DefaultRoutes />}>
          <Route path="/auth/login" element = {<Login />} />
          <Route path='*' element={<div className=' w-[100vw] h-[100vh] overflow-hidden flex justify-center items-center'><div className=' w-[90%] flex-col items-center justify-center gap-[4rem]'><img src="/images/404image.svg" className=" sm:w-[100%] lg:w-[50%] m-auto" /><div className=' text-center'><h4 className=' text-xl'>Page not found</h4><h3>Redirect to <Link className=' text-blue-500 hover:underline hover:text-blue-700' to={"/cms"}>My Dashboard</Link></h3></div></div></div>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App