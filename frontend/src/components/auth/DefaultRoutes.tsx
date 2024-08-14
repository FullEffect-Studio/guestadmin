import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function DefaultRoutes() {
    const  token = localStorage.getItem("access_token")
    if(token){
        return <Navigate to={"/cms"} />
    }
  return (
    <div>
        <Outlet />
    </div>
  )
}
