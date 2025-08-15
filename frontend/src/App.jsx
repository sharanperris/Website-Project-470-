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
import ProtectedRoute from './components/ProtectedRoute'
import ShopContextProvider from './context/ShopContext' 

const App = () => {
  return (
    <ShopContextProvider>
      <div className='w-full min-h-screen'>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Login />} /> 
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
        </Routes>
      </div>
    </ShopContextProvider>
  )
}

export default App