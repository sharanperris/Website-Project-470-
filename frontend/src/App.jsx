import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import About from './pages/About'
import BrowseItem from './pages/BrowseItem'
import PostItem from './pages/PostItem'
import Login from './pages/Login'
import Profile from './pages/Profile'
import ItemDetails from './pages/ItemDetails'
import VerifyOTP from './pages/VerifyOtp.jsx'
import ProtectedRoute from './components/ProtectedRoute'
import ShopContextProvider from './context/ShopContext.jsx' 
import Requests from './pages/Requests'

const App = () => {
  return (
    <div className='w-full min-h-screen'>
      <NavBar />
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Login />} />
          <Route path='/verify-otp' element={<VerifyOTP />} />
          <Route path='/browse-items' element={
            <ProtectedRoute>
              <BrowseItem />
            </ProtectedRoute>
          } />
          <Route path='/items/:id' element={
            <ProtectedRoute>
              <ItemDetails />
            </ProtectedRoute>
          } />
          <Route path='/post-items' element={
            <ProtectedRoute>
              <PostItem />
            </ProtectedRoute>
          } />
          <Route path='/profile' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/requests" element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          } />
      </Routes>
    </div>
  )
}

export default App