import React, { createContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export const ShopContext = createContext()

const ShopContextProvider = ({ children }) => {
  const [token, setToken] = useState('')
  const [userData, setUserData] = useState(null)
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  useEffect(() => {
    // Check for token in localStorage on app load
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
      getUserData(savedToken)
    }
  }, [])

  const getUserData = async (userToken) => {
    try {
      const response = await fetch(`${backendUrl}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setUserData(data.user)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch(`${backendUrl}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setToken(data.token)
        localStorage.setItem('token', data.token)
        await getUserData(data.token)
        toast.success('Login successful!')
        return { success: true }
      } else {
        if (data.requiresVerification) {
          // Don't show toast error for verification requirement
          return { 
            success: false, 
            message: data.message, 
            requiresVerification: true,
            email: data.email 
          }
        } else {
          toast.error(data.message)
          return { success: false, message: data.message }
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
      return { success: false, message: 'Login failed' }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${backendUrl}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        if (data.requiresVerification) {
          // Registration successful but requires OTP verification
          toast.success('Registration successful! Please verify your email with the OTP.')
          return { 
            success: true, 
            requiresVerification: true,
            otp: data.otp 
          }
        } else {
          // Old flow for users who don't need verification
          setToken(data.token)
          localStorage.setItem('token', data.token)
          await getUserData(data.token)
          toast.success('Registration successful!')
          return { success: true }
        }
      } else {
        toast.error(data.message)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
      return { success: false, message: 'Registration failed' }
    }
  }

  const updateProfile = async (updateData) => {
    try {
      const response = await fetch(`${backendUrl}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
    
      const data = await response.json()
    
      if (data.success) {
        setUserData(data.user)
        toast.success('Profile updated successfully!')
        return { success: true }
      } else {
        toast.error(data.message)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Failed to update profile. Please try again.')
      return { success: false, message: 'Update failed' }
    }
  }

  const logout = () => {
    setToken('')
    setUserData(null)
    localStorage.removeItem('token')
    toast.success('Logged out successfully!')
  }

  const value = {
    token,
    setToken,
    userData,
    setUserData,
    backendUrl,
    login,
    register,
    updateProfile,
    logout,
    getUserData
  }

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider