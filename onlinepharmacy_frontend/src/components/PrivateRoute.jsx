import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const PrivateRoute = ({ publicPage = false, adminOnly = false }) => {
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()

  if (publicPage) {
    return user ? <Navigate to='/' replace /> : <Outlet />
  }

  
  if (adminOnly) {
    const isAdmin = user && user?.roles?.includes('ROLE_ADMIN')
  

    if (!user) return <Navigate to='/login' state={{ from: location }} replace />
    if (!isAdmin && !isSeller) return <Navigate to='/' replace />


    return <Outlet />
  }
  return user ? <Outlet /> : <Navigate to='/login' state={{ from: location }} replace />
}

export default PrivateRoute
