

import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {
    // const aToken = "sbdjchbjhbsdjbcjhbjhbjabhsbjbhjcdhbj"
    // const access_token = localStorage.setItem("access_token", aToken)
    const token = localStorage.getItem("access_token")
    if(!token){
        return <Navigate replace to={"/auth/login"} />
    }
  return (
    <div>
        <Outlet />
    </div>
  )
}

export default ProtectedRoutes