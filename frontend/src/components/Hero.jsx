import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-6 md:px-12'>
      {/* Main Hero Content */}
      <div className='max-w-4xl'>
        <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-8 leading-tight'>
          Welcome To Trash To Treasure
        </h1>
        
        <p className='text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed'>
          One's trash, another's treasure
        </p>
        
        <Link 
          to="/login" 
          className='bg-green-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-green-600 hover:shadow-lg transition-all duration-200 inline-block'
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}

export default Hero