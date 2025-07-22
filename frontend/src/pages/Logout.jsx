import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    
    // Optional: Show a logout message
    alert('You have been logged out successfully!');
    
    // Redirect to home page
    navigate('/');
  }, [navigate]);

  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] text-gray-800'>
      <div className='text-center'>
        <h2 className='text-2xl font-medium mb-4'>Logging out...</h2>
        <p className='text-gray-600'>Please wait while we log you out.</p>
      </div>
    </div>
  )
}

export default Logout