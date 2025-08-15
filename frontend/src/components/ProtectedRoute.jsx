import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    // If no token, redirect to login with a message
    return <Navigate to="/login" state={{ message: "Please login to access your profile" }} replace />
  }
  
  return children
}

export default ProtectedRoute