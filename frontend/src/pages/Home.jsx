import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext' 

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  // If you're using context:
  // const { user } = useContext(ShopContext)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)

    // Optional: If you store user info in localStorage or context
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userObj = JSON.parse(storedUser)
      setUsername(userObj.name || '')
    }
  }, [])

  return (
    <div className='min-h-screen flex items-center justify-between bg-gray-50 px-6 md:px-12 lg:px-20'>
      {/* Left Content Section */}
      <div className='flex-1 max-w-lg'>
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-400 mb-6 leading-tight'>
          {isLoggedIn
            ? `WELCOME!`
            : `ONE'S TRASH IS ANOTHER'S TREASURE.`}
        </h1>

        <p className='text-gray-500 text-lg mb-8 leading-relaxed'>
          {isLoggedIn
            ? 'Got something to give? Or maybe to grab?'
            : 'Join a community where generosity meets sustainability. Post what you don’t need, and discover what others are giving away — for free.'}
        </p>

        <Link
          to={isLoggedIn ? '/browse-items' : '/login?mode=signup'}
          className='inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200'
        >
          {isLoggedIn ? 'BROWSE ITEMS' : 'GET STARTED'}
        </Link>
      </div>

      {/* Right Illustration Section */}
      <div className='flex-1 flex justify-end items-center pl-8'>
        <div className='w-full max-w-lg lg:max-w-xl xl:max-w-2xl'>
          <img
            src={assets.illustration}
            alt='Sustainable Business Illustration'
            className='w-full h-auto'
          />
        </div>
      </div>
    </div>
  )
}

export default Home