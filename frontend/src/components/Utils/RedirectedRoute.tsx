import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const RedirectedRoute = () => {
    if(window.location.href = "/"){
        <Navigate replace to={"/cms"} />
    }
  return (
    <>
        <Outlet />
    </>
  )
}

export default RedirectedRoute